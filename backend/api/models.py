from django.db import models
from django.contrib.auth.models import User

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
