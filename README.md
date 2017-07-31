# Des applications ultra-rapides avec Node.js

Projet de validation du cours Nodejs sur [openclassroom](https://openclassrooms.com/). Le lien du projet est : [Node.js - Semaine 3](https://openclassrooms.com/courses/des-applications-ultra-rapides-avec-node-js/exercises/68).

## Information sur le projet
Le codeutilise la synthaxe ES6, donc ne soyez pas etonné de voir par exemple la syntaxe

```js
deleteTodo = (id) => {
    socket.emit('delete-todo', id)
}
```

ca vaux en JS classique 
```js
var deleteTodo = function (id) {
    socket.emit('delete-todo', id);
}
```

Je vous laisse decouvrir un peu cette synthaxe que je vous conseille fortement à utiliser.

## Execution du projet
Apres avoir telecharger les source et dezippeer, vous vous positionnez dans le repertoire du projet et vous executez la commande suivante :
```sh
$ npm install 
```

## Lancer l'application:

En mode production pour tester l'application

```sh
$ npm run start
```

En mode develeppement si vous voulez recharger le serveur aà chaque modification du fichier index.js, il lancera le serveur avec nodemon
```sh
$ npm run dev
```

En cas de probleme d'execution car le port est utilisé, il suffit de modifier le port dans le fichier .env, par défaut, il est fixé à 8080

Bonne correction ;)

Marwein