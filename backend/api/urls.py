from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProdutoViewSet, 
    CarrinhoViewSet, 
    RegistrarUsuarioView, 
    MyTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produtos')
router.register(r'carrinho', CarrinhoViewSet, basename='carrinho')

urlpatterns = [
    path('', include(router.urls)),
    
    path('usuarios/registrar/', RegistrarUsuarioView.as_view(), name='registrar'),
    
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
