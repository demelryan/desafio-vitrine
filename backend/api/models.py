from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_delete, pre_save 
from django.dispatch import receiver 
import os 

class Produto(models.Model):
    nome = models.CharField(max_length=255)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField()
    imagem_url = models.ImageField(upload_to='produtos/', blank=True, null=True) 
    
    categoria = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    
    vendedor = models.ForeignKey(User, on_delete=models.CASCADE)
    vendedor_nome = models.CharField(max_length=255)
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class ProdutoImagem(models.Model):
    produto = models.ForeignKey(Produto, related_name='imagens', on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='produtos/galeria/')

    def __str__(self):
        return f"Imagem de {self.produto.nome}"

class CarrinhoItem(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome} (Dono: {self.usuario.username})"

@receiver(post_delete, sender=Produto)
def deletar_imagem_ao_excluir_produto(sender, instance, **kwargs):
    if instance.imagem_url:
        if os.path.isfile(instance.imagem_url.path):
            os.remove(instance.imagem_url.path)

@receiver(post_delete, sender=ProdutoImagem)
def deletar_imagem_galeria_ao_excluir(sender, instance, **kwargs):
    if instance.imagem:
        if os.path.isfile(instance.imagem.path):
            os.remove(instance.imagem.path)

@receiver(pre_save, sender=Produto)
def deletar_imagem_antiga_na_troca(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        antigo_produto = Produto.objects.get(pk=instance.pk)
    except Produto.DoesNotExist:
        return False

    nova_imagem = instance.imagem_url
    antiga_imagem = antigo_produto.imagem_url

    if antiga_imagem and antiga_imagem != nova_imagem:
        if os.path.isfile(antiga_imagem.path):
            os.remove(antiga_imagem.path)
