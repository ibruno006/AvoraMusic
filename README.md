# Avora

**Talentos próximos. Encontros que viram música.**

Protótipo responsivo de marketplace musical para apresentação acadêmica. Feito com HTML, CSS e JavaScript puro, sem backend, dependências, chaves ou serviços externos.

## Executar localmente

Abra `index.html` no navegador. Como o projeto usa scripts locais convencionais e não faz chamadas de rede, também funciona sem servidor. Alternativamente, abra a pasta no VS Code e use a extensão Live Server.

## Fluxo principal

1. Na entrada, escolha **Sou contratante** e selecione **Explorar demonstração**.
2. Busque um artista ou aplique filtros de cidade, estilo, faixa de cachê e disponibilidade.
3. Abra um perfil, veja formação, regiões atendidas, disponibilidade e avaliações fictícias.
4. Selecione **Solicitar orçamento** e preencha os detalhes do evento.
5. Use **Alternar perfil** para entrar como músico e visualizar, aceitar ou recusar o pedido.

O mural permite consultar e publicar oportunidades de contratação e parceria musical. A área do músico permite editar o perfil, sinalizar disponibilidade e selecionar dias preferidos. Favoritos podem ser adicionados ou removidos em artistas e oportunidades. **Restaurar dados iniciais** limpa as alterações locais.

O botão de sol/lua alterna entre os temas claro e noturno. A escolha fica salva localmente, separada dos dados de demonstração.

## Demonstração e privacidade

- E-mail e senha existem apenas para demonstrar os formulários de entrada e cadastro. O acesso é simulado; credenciais não são validadas, enviadas nem armazenadas.
- Favoritos, interesses em oportunidades, solicitações, anúncios publicados e ajustes do perfil são os únicos dados gravados, em `localStorage` neste navegador.
- Artistas, cidades, avaliações, portfólio sem arquivos e anúncios iniciais são dados fictícios. Não há transações, mensagens, notificações ou pagamentos reais.
- As imagens disponibilizadas junto ao projeto são capturas de referência de interface, não retratos de artistas; por isso, o protótipo usa avatares gráficos e não simula mídia de portfólio inexistente.

## Estrutura

```text
index.html
css/styles.css
js/data.js
js/app.js
README.md
```

`js/data.js` contém o catálogo demonstrativo. `js/app.js` concentra estado, renderização e a camada de persistência local, que pode ser substituída futuramente por clientes de API REST, autenticação e serviços próprios. Nenhuma integração com PostgreSQL ou serviço externo foi implementada.