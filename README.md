côté backend: 
Le backend de Exam Hub permet de gérer les examens QCM
L'application possède deux rôles : Admin et Student

Applications: 
-Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- JWT
- bcrypt

Les installations: 
- npm install
- npm install express
- npm install dotenv


Créer un fichier .env avec les informations de connexion à PostgreSQL pour lancer le serveur

- npm run dev: pour lancer le serveur
- Le backend est accessible sur :http://localhost:3000 
- Authentification: POST /api/auth/login 
- Les routes protégées utilisent un token JWT. 
- Après la connexion, le token doit être envoyé dans le header  
- Authorization: Bearer <token> 
- Test dans postman 
- Il faut d'abord se connecter pour récupérer le token, puis utiliser ce token pour accéder aux routes protégées. 
Corrige et structurele bien