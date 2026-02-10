from django.contrib import admin
from .models import Produto, CarrinhoItem, ProdutoImagem

class ProdutoImagemInline(admin.TabularInline):
    model = ProdutoImagem
    extra = 3 

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'preco', 'vendedor_nome', 'cidade', 'criado_em')
    search_fields = ('nome', 'vendedor_nome')
    inlines = [ProdutoImagemInline]

admin.site.register(CarrinhoItem)
