/**
 * Entrée de l’application mobile (prototype).
 * L’application se connecte au backend FastAPI pour gérer les
 * utilisateurs, l’authentification, les dépôts, les transferts et le fil social.
 */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

const API_URL = 'http://localhost:8000';

const App = () => {
  // État pour l’inscription et la connexion
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [token, setToken] = useState(null);
  // État pour la gestion des utilisateurs et des transactions
  const [username, setUsername] = useState('');
  const [depositUser, setDepositUser] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const [feed, setFeed] = useState([]);
  const [status, setStatus] = useState('');

  // Récupération du fil d’activité au montage du composant
  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${API_URL}/feed`);
      const data = await res.json();
      setFeed(data);
    } catch (err) {
      setStatus('Erreur lors de la récupération du fil');
    }
  };

  // Création d’un utilisateur sans mot de passe (prototype)
  const handleCreateUser = async () => {
    if (!username) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        setStatus(`Utilisateur ${username} créé`);
        setUsername('');
      } else {
        const errData = await res.json();
        setStatus(errData.detail || 'Erreur');
      }
    } catch (err) {
      setStatus('Erreur de réseau');
    }
  };

  // Inscription avec mot de passe
  const handleSignup = async () => {
    if (!signupUsername || !signupPassword) return;
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Utilisateur ${signupUsername} créé`);
        setSignupUsername('');
        setSignupPassword('');
      } else {
        setStatus(data.detail || "Erreur à l’inscription");
      }
    } catch (err) {
      setStatus('Erreur réseau lors de l’inscription');
    }
  };

  // Connexion : stockage du jeton
  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) return;
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Connexion réussie pour ${loginUsername}`);
        setLoginUsername('');
        setLoginPassword('');
        setToken(data.token);
      } else {
        setStatus(data.detail || "Erreur à la connexion");
      }
    } catch (err) {
      setStatus('Erreur réseau lors de la connexion');
    }
  };

  // Dépôt (nécessite un jeton)
  const handleDeposit = async () => {
    if (!depositUser || !depositAmount) return;
    try {
      const res = await fetch(`${API_URL}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ username: depositUser, amount: parseFloat(depositAmount) }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message);
        setDepositUser('');
        setDepositAmount('');
      } else {
        setStatus(data.detail || 'Erreur');
      }
    } catch (err) {
      setStatus('Erreur de réseau');
    }
  };

  // Transfert (nécessite un jeton)
  const handleTransfer = async () => {
    if (!sender || !recipient || !transferAmount) return;
    try {
      const res = await fetch(`${API_URL}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          sender,
          recipient,
          amount: parseFloat(transferAmount),
          message: transferMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message);
        setSender('');
        setRecipient('');
        setTransferAmount('');
        setTransferMessage('');
        fetchFeed();
      } else {
        setStatus(data.detail || 'Erreur');
      }
    } catch (err) {
      setStatus('Erreur de réseau');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Inscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inscription</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={signupUsername}
            onChangeText={setSignupUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={signupPassword}
            onChangeText={setSignupPassword}
          />
          <Button title="S'inscrire" onPress={handleSignup} />
        </View>

        {/* Connexion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connexion</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={loginUsername}
            onChangeText={setLoginUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={loginPassword}
            onChangeText={setLoginPassword}
          />
          <Button title="Se connecter" onPress={handleLogin} />
        </View>

        <Text style={styles.title}>Application P2P</Text>

        {/* Création d'utilisateur (prototype) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Créer un utilisateur</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
          <Button title="Créer" onPress={handleCreateUser} />
        </View>

        {/* Dépôt */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Déposer des fonds</Text>
          <TextInput
            style={styles.input}
            placeholder="Utilisateur"
            value={depositUser}
            onChangeText={setDepositUser}
          />
          <TextInput
            style={styles.input}
            placeholder="Montant"
            keyboardType="numeric"
            value={depositAmount}
            onChangeText={setDepositAmount}
          />
          <Button title="Déposer" onPress={handleDeposit} />
        </View>

        {/* Transfert */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transférer des fonds</Text>
          <TextInput
            style={styles.input}
            placeholder="Expéditeur"
            value={sender}
            onChangeText={setSender}
          />
          <TextInput
            style={styles.input}
            placeholder="Destinataire"
            value={recipient}
            onChangeText={setRecipient}
          />
          <TextInput
            style={styles.input}
            placeholder="Montant"
            keyboardType="numeric"
            value={transferAmount}
            onChangeText={setTransferAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Message (facultatif)"
            value={transferMessage}
            onChangeText={setTransferMessage}
          />
          <Button title="Transférer" onPress={handleTransfer} />
        </View>

        {/* Fil des transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fil d'activité</Text>
          {feed.map((tx, index) => (
            <Text key={index} style={styles.feedItem}>
              {tx.sender} → {tx.recipient} : {tx.amount} $ – {tx.message}
            </Text>
          ))}
        </View>

        {/* Affichage du statut */}
        {status ? <Text style={styles.status}>{status}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  feedItem: { fontSize: 14, marginBottom: 4 },
  status: {
    marginTop: 16,
    fontStyle: 'italic',
    color: 'red',
  },
});

export default App;
