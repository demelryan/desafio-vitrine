from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, CarrinhoViewSet, RegistrarUsuarioView

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produtos')
router.register(r'carrinho', CarrinhoViewSet, basename='carrinho')

urlpatterns = [
    path('', include(router.urls)),
    
    path('usuarios/registrar/', RegistrarUsuarioView.as_view(), name='registrar'),
]
