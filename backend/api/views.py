from rest_framework import viewsets, permissions, generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from .models import Produto, CarrinhoItem, ProdutoImagem 
from .serializers import ProdutoSerializer, CarrinhoItemSerializer, UserSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['first_name'] = self.user.first_name
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegistrarUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        nome_exibicao = self.request.user.first_name or self.request.user.username
        
        produto = serializer.save(
            vendedor=self.request.user, 
            vendedor_nome=nome_exibicao
        )
        
        imagens_extras = self.request.FILES.getlist('imagens_adicionais')
        for img in imagens_extras:
            ProdutoImagem.objects.create(produto=produto, imagem=img)

    def perform_update(self, serializer):
        produto = serializer.save()
        
        imagens_extras = self.request.FILES.getlist('imagens_adicionais')
        
        for img in imagens_extras:
            ProdutoImagem.objects.create(produto=produto, imagem=img)

class CarrinhoViewSet(viewsets.ModelViewSet):
    serializer_class = CarrinhoItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CarrinhoItem.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        produto = serializer.validated_data.get('produto')
        item_existente = CarrinhoItem.objects.filter(usuario=self.request.user, produto=produto).first()
        
        if item_existente:
            item_existente.quantidade += serializer.validated_data.get('quantidade', 1)
            item_existente.save()
            serializer.instance = item_existente
        else:
            serializer.save(usuario=self.request.user)
