**Adote um Bichinho**

Pequeno app Expo / React Native para listar pets para adoção, com telas de login, cadastro, filtros, feed, detalhes, chat por pet e perfil de usuário.

**Pré-requisitos**:
- **Node.js**: Versão LTS (ex.: 16/18+).
- **npm** ou **yarn**: gerenciador de pacotes.
- **Expo CLI** (opcional): use via `npx expo`.
- **Expo Go** (Android/iOS) para testar em dispositivo físico.

**Instalação (rápido)**:
```bash
cd c:/Users/LucasSilveira/Desktop/projetos/adote-pet
npm install
```

Se for necessário usar túnel (acesso remoto pelo QR), instale/garanta `@expo/ngrok` (já está como devDependency neste projeto):

```bash
npm install @expo/ngrok --save-dev
```

**Scripts úteis** (definidos em [package.json](package.json)):
- **start**: `npm start` → inicia o Metro/Expo (modo interativo).
- **web**: `npm run web` → abre a versão web em `http://localhost:8081`.
- **android**: `npm run android` → abre no emulador/dispositivo Android (via Expo).
- **ios**: `npm run ios` → abre no emulador/dispositivo iOS (macOS).

Comandos comuns:
```bash
npm start                 # iniciar Expo (modo padrão)
npx expo start --web --clear   # iniciar apenas web (limpando cache)
npx expo start --tunnel --clear # iniciar com túnel (ngrok)
```

**Arquivos principais**:
- **Código fonte**: [App.js](App.js) — toda a UI/estado atual está neste único arquivo.
- **Manifesto**: [package.json](package.json)

**Fluxos e funcionalidades**:
- **Cadastro**: campos obrigatórios: Nome Completo, E-mail, Data de Nascimento (formato DD/MM/AAAA) e Senha.
  - A senha exige: mínimo 8 caracteres, ao menos uma letra maiúscula e 1 caractere especial. Validação em `isStrongPassword` em `App.js`.
  - A data é formatada por `formatBirthDate` em `App.js`.
- **Home**: filtros por porte, energia, compatibilidade com crianças e favoritos.
- **Detalhes do pet**: botão `Quero adotar` inicia fluxo de adoção e abre automaticamente o chat relacionado ao pet.
- **Chat**: conversa por pet (lista de conversas na aba `Chat`). Observação: conversas são mantidas somente em memória (estado React) — são perdidas ao recarregar a aplicação.

**Testes manuais recomendados**:
- Registrar um usuário em [App.js](App.js) → testar validação de senha e formatação da data.
- Fazer login com o usuário cadastrado.
- Abrir um pet e clicar em `Quero adotar` → verificar se o chat abre e a conversa aparece na aba `Chat`.
- No web: abrir `http://localhost:8081` (ou a porta exibida pelo Expo) e observar logs no console do navegador.

**Problemas conhecidos e soluções**:
- **Túnel ngrok falha / expira**: pode ocorrer por bloqueio de rede. Alternativas:
  - usar `npm run web` e testar localmente em `http://localhost:8081`;
  - abrir o app no celular via Expo Go usando o endereço LAN (exp://<seu-ip>:8081) se o dispositivo estiver na mesma rede;
  - se necessário, instalar `@expo/ngrok` e reiniciar: `npm install @expo/ngrok --save-dev` e `npx expo start --tunnel --clear`.
- **Porta em uso**: se o Expo reclamar que a porta está ocupada, finalize processos `node.exe` que ocupam portas 808x ou responda `Y` para aceitar porta alternativa quando o Expo perguntar.
- **Cache do Metro/erro DiskCacheManager**: limpar cache com `npx expo start --clear` ou remover pasta de cache do Metro (ex.: `.metro-cache` / `.expo`).

**Limitações atuais / melhorias sugeridas**:
- Persistência: as conversas e o estado do usuário são apenas em memória — usar `AsyncStorage` ou um backend (Firebase / API REST) para persistência.
- Navegação: atualmente a navegação é baseada em estado em `App.js`; migrar para `react-navigation` melhora escala e manutenção.
- Autenticação: adicionar backend seguro para cadastro/login (JWT, refresh tokens).
