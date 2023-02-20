# Pierre Feuille Ciseaux


## Récupérer le projet

*cloner le projet*

```bash  
git clone git@github.com:ChaimaBdh/pfc-project.git 
```

*se placer dans le répertoire*  

```bash  
cd pfc-project/pfc
```  

## Installer les modules

```bash  
npm install
```  

## Générer le bundle

```bash  
npm run build
```  

## Lancer le serveur  

```bash  
nodemon
```  
ou  

```bash  
npm run start  
```  

## Jouer en réseau

*Ouvrir le lien dans le navigateur pour 2 machines*  

```bash  
<host ip>:8080
```  
ou

```bash  
localhost:8080
```  

## Compléments

**Il existe 3 routes fonctionnelles :**

- **/** livre une page d'accueil qui présente le jeu et fournit des liens vers les autres routes.  
- **/about** informe sur les auteurs et le but du jeu.  
- **/pfc** permet d'accéder au jeu.  


**NB: toute connexion supérieure à 2, sera rejetée. Le jeu n'est accessible que par 2 machines. Si une troisième tente de se connecter alors que 2 machines sont déjà connectées, elle sera redirigée vers une page d'erreur.**
