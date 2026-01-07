# 🧭 Guide d'Installation Technique : GCP, Firebase & Stripe

Ce guide vous accompagne pas à pas pour configurer les infrastructures nécessaires au déploiement des 55 fonctionnalités de votre site TEDSAI.

---

## 1. ☁️ Google Cloud Platform (GCP)
C'est ici que résidera l'intelligence (IA) et la puissance de calcul (Cloud Run).

### Étape 1.1 : Créer le Projet
1.  Allez sur la [Console GCP](https://console.cloud.google.com/).
2.  Cliquez sur le sélecteur de projet en haut à gauche (à côté de "Google Cloud").
3.  Cliquez sur **"NOUVEAU PROJET"**.
4.  Nom du projet : `tedsai-prod`.
5.  Cliquez sur **"CRÉER"**.

### Étape 1.2 : Activer la Facturation
> [!IMPORTANT]
> Google offre $300 de crédit gratuit aux nouveaux utilisateurs. Sans facturation activée, les services IA resteront bloqués.
1.  Dans le menu de gauche, allez sur **"Facturation"**.
2.  Cliquez sur **"LIER UN COMPTE DE FACTURATION"**.
3.  Suivez les instructions pour ajouter votre carte. (Vous ne serez pas débité au-delà des crédits gratuits sans votre accord).

### Étape 1.3 : Activer les APIs
1.  Dans la barre de recherche en haut, tapez "**Vertex AI API**" et cliquez sur le résultat. Cliquez sur **"ACTIVER"**.
2.  Faites de même pour "**Cloud Run API**". Cliquez sur **"ACTIVER"**.

---

## 2. 🔥 Firebase
C'est votre base de données en temps réel et votre système de sécurité.

### Étape 2.1 : Lier le projet à Firebase
1.  Allez sur la [Console Firebase](https://console.firebase.google.com/).
2.  Cliquez sur **"Ajouter un projet"**.
3.  Sélectionnez votre projet `tedsai-prod` dans la liste.
4.  Cliquez sur **"Continuer"** jusqu'à la création.

### Étape 2.2 : Récupérer les clés API (Frontend)
1.  Dans la console Firebase, cliquez sur la roue dentée ⚙️ -> **"Paramètres du projet"**.
2.  Dans l'onglet **"Général"**, descendez jusqu'à **"Vos applications"**.
3.  Cliquez sur l'icône Web `</>`.
4.  Enregistrez l'application (ex: `tedsai-web`).
5.  **Copiez l'objet `firebaseConfig`** qui ressemble à ceci :
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "tedsai-prod.firebaseapp.com",
      projectId: "tedsai-prod",
      ...
    };
    ```

### Étape 2.3 : Générer la Clé de Service (Backend)
1.  Toujours dans **"Paramètres du projet"**, allez sur l'onglet **"Comptes de service"**.
2.  Cliquez sur le bouton bleu **"Générer une nouvelle clé privée"**.
3.  **Téléchargez le fichier JSON**. Copiez son contenu et transmettez-le moi.

---

## 3. 💳 Stripe
C'est votre moteur de paiement pour le restaurant et le jardin.

### Étape 3.1 : Création du compte
1.  Inscrivez-vous sur [Stripe](https://dashboard.stripe.com/register).
2.  Activez votre compte en remplissant les informations de votre entreprise/identité.

### Étape 3.2 : Récupérer les clés de Test
1.  Sur le Dashboard Stripe, assurez-vous que le **"Mode Test"** est activé (en haut à droite).
2.  Allez dans ** Développeurs** -> **Clés API**.
3.  Copiez la **Clé publiable** (`pk_test_...`) et la **Clé secrète** (`sk_test_...`).

---

## 🚀 Que faire ensuite ?
Une fois que vous avez ces éléments :
1.  Donnez-moi les **Clés API Firebase**.
2.  Donnez-moi le contenu du **JSON Service Account**.
3.  Donnez-moi les **Clés Stripe (Test)**.

**Je m'occupe du reste pour transformer ces clés en fonctionnalités vivantes sur votre site !**
