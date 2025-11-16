# IzziView

Catálogo interativo de filmes e séries usando a API do TMDb (The Movie Database).

## Descrição

Aplicação web desenvolvida como projeto da disciplina de Programação Web da UESPI 2025. 
Permite navegar por filmes e séries lançados em 2025, com filtros inteligentes por gênero, 
tipo de conteúdo e ordenação.

## Funcionalidades

-  Listagem de filmes e séries de 2025
-  Filtros por gênero (Ação, Comédia, Drama, Thriller, etc)
-  Filtro por tipo (Filmes, Séries ou Todos)
-  Ordenação (Mais populares / Mais bem avaliados)
-  Filtros inteligentes de país e idioma (remove conteúdo irrelevante)
-  Paginação avançada com navegação intuitiva
-  Página de detalhes com informações completas
-  Exibição do elenco com fotos
-  Lista de temporadas (para séries)
-  Persistência de filtros entre navegações (localStorage)
-  Design responsivo (mobile-first)
-  Tratamento de erros de API
-  Fallback automático para imagens quebradas
-  Modo Escuro

##  Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização personalizada
- **Tailwind CSS** - Framework CSS utilitário
- **JavaScript ES6+** - Lógica e interatividade
- **TMDb API** - Fonte de dados de filmes e séries
- **Git/GitHub** - Controle de versão e colaboração

##  Como Usar

### Opção 1: Abrir diretamente

1. Clone o repositório:
bash
git clone https://github.com/SEU-USUARIO/izzi-view.git
cd izzi-view

Abra o arquivo index.html no navegador
Opção 2: Usar servidor local (recomendado)
Clone o repositório (comando acima)


Inicie um servidor local:


Com Python 3:
python -m http.server 8000

Com Node.js (http-server):
npx http-server

Acesse http://localhost:8000 no navegador

## Equipe

Olimpio de Carvalho Andrade - Backend / Integração com API / Lógica de Filtros

Wellyson dos Santos Silva - Frontend / UI/UX / Páginas

## Funcionalidades Técnicas

Filtros Inteligentes

O projeto implementa filtros avançados para garantir conteúdo relevante:

- Filtro de data: Apenas conteúdo lançado em 2025

- Filtro de idioma: Apenas português,inglês e espanhol

- Resultado: Remove automaticamente filmes indianos, asiáticos e outros conteúdos irrelevantes


Persistência de Estado

O sistema salva automaticamente os filtros selecionados usando localStorage, permitindo que o usuário retorne exatamente onde estava após navegar para a página de detalhes.

- Tratamento de Erros
- Erros de rede são detectados e exibidos ao usuário
- Erros 404 mostram mensagens específicas
- Erros de servidor (500+) são tratados apropriadamente
- Imagens quebradas têm fallback automático para placeholders

Links Úteis

TMDb API Documentation : https://developer.themoviedb.org/docs/getting-started

Tailwind CSS : https://tailwindcss.com/

Licença
Projeto acadêmico desenvolvido para fins educacionais - UESPI 2025
