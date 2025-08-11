/**
 * Entrée de l’application mobile (prototype).
 * Ce fichier sert uniquement de point de départ pour une application React Native.
 * L’application se connectera ultérieurement au backend FastAPI pour gérer les
 * utilisateurs, les dépôts, les transferts et le fil social.
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
  const [username, setUsername] = useState('');
  const [depositUser, setDepositUser] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const [feed, setFeed] = useState([]);
  const [status, setStatus] = useState('');

  // Récupérer le fil au montage du composant
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

  const handleDeposit = async () => {
    if (!depositUser || !depositAmount) return;
    try {
      const res = await fetch(`${API_URL}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleTransfer = async () => {
    if (!sender || !recipient || !transferAmount) return;
    try {
      const res = await fetch(`${API_URL}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <Text style={styles.title}>Application P2P</Text>

        {/* Section création d’utilisateur */}
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

        {/* Section dépôt */}
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

        {/* Section transfert */}
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

        {/* Section fil des transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fil d’activité</Text>
          {feed.map((tx, index) => (
            <Text key={index} style={styles.feedItem}>
              {tx.sender} → {tx.recipient} : {tx.amount} $ – {tx.message}
            </Text>
          ))}
        </View>

        {/* Statut */}
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
