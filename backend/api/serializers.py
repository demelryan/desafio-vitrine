from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Produto, CarrinhoItem, ProdutoImagem

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            email=validated_data.get('email', '')
        )
        return user

class ProdutoImagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoImagem
        fields = ['id', 'imagem']

class ProdutoSerializer(serializers.ModelSerializer):
    vendedor = serializers.ReadOnlyField(source='vendedor.id')
    vendedor_nome = serializers.ReadOnlyField()
    
    imagem_url = serializers.SerializerMethodField()
    imagens = ProdutoImagemSerializer(many=True, read_only=True)

    class Meta:
        model = Produto
        fields = [
            'id', 'nome', 'preco', 'descricao', 'imagem_url', 
            'categoria', 'cidade', 'vendedor', 'vendedor_nome', 'imagens'
        ]

    def get_imagem_url(self, obj):
        if obj.imagem_url:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagem_url.url)
            return obj.imagem_url.url
        return None

class CarrinhoItemSerializer(serializers.ModelSerializer):
    produto_detalhes = ProdutoSerializer(source='produto', read_only=True)

    class Meta:
        model = CarrinhoItem
        fields = ['id', 'produto', 'quantidade', 'produto_detalhes', 'usuario']
        read_only_fields = ['usuario']
