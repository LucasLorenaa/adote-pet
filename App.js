import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const PETS = [
  {
    id: 1,
    name: 'Luna',
    type: 'Cachorro',
    age: '2 anos',
    size: 'Médio',
    energy: 'Alta',
    kids: true,
    description: 'Muito carinhosa, adora brincar e correr no parque.',
    ngo: 'Amigos Peludos',
    emoji: '🐶',
  },
  {
    id: 2,
    name: 'Mimo',
    type: 'Gato',
    age: '1 ano',
    size: 'Pequeno',
    energy: 'Média',
    kids: true,
    description: 'Calmo, companheiro e ótimo para apartamentos.',
    ngo: 'Patas Felizes',
    emoji: '🐱',
  },
  {
    id: 3,
    name: 'Rex',
    type: 'Cachorro',
    age: '4 anos',
    size: 'Grande',
    energy: 'Baixa',
    kids: false,
    description: 'Tranquilo, ideal para quem busca um companheiro mais sereno.',
    ngo: 'Coração Animal',
    emoji: '🐕',
  },
  {
    id: 4,
    name: 'Nina',
    type: 'Gato',
    age: '3 anos',
    size: 'Pequeno',
    energy: 'Alta',
    kids: true,
    description: 'Curiosa, gosta de atenção e de ficar perto de crianças.',
    ngo: 'Resgate Verde',
    emoji: '🐈',
  },
];

const DEFAULT_CHAT = [
  { id: 1, sender: 'ong', text: 'Olá! Como vai? Conte um pouco sobre seu perfil.' },
  { id: 2, sender: 'user', text: 'Tudo bem! Gostaria de conhecer pets calmos e amigáveis.' },
  { id: 3, sender: 'ong', text: 'Perfeito! O Luna combina muito com esse perfil.' },
];

const formatBirthDate = (value) => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 8);

  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }

  if (digitsOnly.length <= 4) {
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
  }

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
};

const isStrongPassword = (password) => /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}).+$/.test(password);

export default function App() {
  const [screen, setScreen] = useState('login');
  const [selectedPet, setSelectedPet] = useState(PETS[0]);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [signup, setSignup] = useState({
    name: '',
    email: '',
    birthDate: '',
    password: '',
  });
  const [login, setLogin] = useState({ email: '', password: '' });
  const [filters, setFilters] = useState({
    size: 'Todos',
    energy: 'Todos',
    kids: 'Todos',
  });
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState(DEFAULT_CHAT);

  const filteredPets = useMemo(() => {
    return PETS.filter((pet) => {
      const matchesSize = filters.size === 'Todos' || pet.size === filters.size;
      const matchesEnergy = filters.energy === 'Todos' || pet.energy === filters.energy;
      const matchesKids =
        filters.kids === 'Todos' ||
        (filters.kids === 'Sim' && pet.kids) ||
        (filters.kids === 'Não' && !pet.kids);

      return matchesSize && matchesEnergy && matchesKids;
    });
  }, [filters]);

  const handleSignup = () => {
    const { name, email, birthDate, password } = signup;

    if (!name || !email || !birthDate || !password) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os dados do cadastro.');
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter no mínimo 8 caracteres, pelo menos uma letra maiúscula e um caractere especial.'
      );
      return;
    }

    const newUser = {
      name,
      email: email.trim().toLowerCase(),
      birthDate,
      password,
    };

    setRegisteredUser(newUser);
    setLogin({ email: newUser.email, password: '' });
    setScreen('login');
    Alert.alert('Cadastro concluído', 'Agora você pode entrar com o e-mail e senha cadastrados.');
    setSignup({ name: '', email: '', birthDate: '', password: '' });
  };

  const handleLogin = () => {
    const typedEmail = login.email.trim().toLowerCase();
    const typedPassword = login.password;

    if (!typedEmail || !typedPassword) {
      Alert.alert('Login incompleto', 'Informe seu e-mail e sua senha.');
      return;
    }

    if (!registeredUser) {
      Alert.alert('Cadastro não encontrado', 'Crie uma conta antes de fazer o login.');
      return;
    }

    if (typedEmail !== registeredUser.email || typedPassword !== registeredUser.password) {
      Alert.alert('Credenciais inválidas', 'E-mail ou senha incorretos.');
      return;
    }

    setScreen('home');
    Alert.alert('Bem-vindo(a)', `Olá, ${registeredUser.name}!`);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageText.trim(),
    };

    setChatMessages((current) => [...current, newMessage]);
    setMessageText('');
  };

  const renderLoginScreen = () => (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F3" />
      <View style={styles.logoCard}>
        <Text style={styles.logoEmoji}>🐾</Text>
        <Text style={styles.brand}>Adote um Bichinho</Text>
        <Text style={styles.subtitle}>Encontre seu melhor amigo</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={login.email}
          onChangeText={(text) => setLogin((current) => ({ ...current, email: text }))}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          secureTextEntry
          value={login.password}
          onChangeText={(text) => setLogin((current) => ({ ...current, password: text }))}
        />

        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => setScreen('register')}>
          <Text style={styles.secondaryText}>
            Ainda não tem conta? <Text style={styles.linkText}>Cadastre-se</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const renderRegisterScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.registerCard}>
        <Text style={styles.title}>Cadastro</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome completo"
          value={signup.name}
          onChangeText={(text) => setSignup((current) => ({ ...current, name: text }))}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={signup.email}
          onChangeText={(text) => setSignup((current) => ({ ...current, email: text }))}
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
          value={signup.birthDate}
          onChangeText={(text) =>
            setSignup((current) => ({ ...current, birthDate: formatBirthDate(text) }))
          }
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Crie uma senha"
          secureTextEntry
          value={signup.password}
          onChangeText={(text) => setSignup((current) => ({ ...current, password: text }))}
        />
        <Text style={styles.helperText}>
          Mínimo de 8 caracteres, com pelo menos uma letra maiúscula e um caractere especial.
        </Text>

        <Pressable style={styles.primaryButton} onPress={handleSignup}>
          <Text style={styles.primaryButtonText}>Cadastrar</Text>
        </Pressable>

        <Pressable onPress={() => setScreen('login')}>
          <Text style={styles.secondaryText}>
            Já possui conta? <Text style={styles.linkText}>Fazer login</Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderHomeScreen = () => (
    <ScrollView style={styles.homeContainer} contentContainerStyle={styles.homeContent}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Olá, {registeredUser?.name?.split(' ')[0] || 'Amigo'}!</Text>
          <Text style={styles.headerTitle}>Encontre o pet ideal</Text>
        </View>
        <Pressable style={styles.avatarButton} onPress={() => setScreen('login')}>
          <Text style={styles.avatarText}>Sair</Text>
        </Pressable>
      </View>

      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>Filtros avançados</Text>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Porte</Text>
          <View style={styles.chipGroup}>
            {['Todos', 'Pequeno', 'Médio', 'Grande'].map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, filters.size === item && styles.chipSelected]}
                onPress={() => setFilters((current) => ({ ...current, size: item }))}
              >
                <Text style={[styles.chipText, filters.size === item && styles.chipTextSelected]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Energia</Text>
          <View style={styles.chipGroup}>
            {['Todos', 'Baixa', 'Média', 'Alta'].map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, filters.energy === item && styles.chipSelected]}
                onPress={() => setFilters((current) => ({ ...current, energy: item }))}
              >
                <Text style={[styles.chipText, filters.energy === item && styles.chipTextSelected]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Com crianças</Text>
          <View style={styles.chipGroup}>
            {['Todos', 'Sim', 'Não'].map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, filters.kids === item && styles.chipSelected]}
                onPress={() => setFilters((current) => ({ ...current, kids: item }))}
              >
                <Text style={[styles.chipText, filters.kids === item && styles.chipTextSelected]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.petList}>
        {filteredPets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhum pet encontrado</Text>
            <Text style={styles.emptyText}>Ajuste os filtros para ver outras opções.</Text>
          </View>
        ) : (
          filteredPets.map((pet) => (
            <Pressable
              key={pet.id}
              style={styles.petCard}
              onPress={() => {
                setSelectedPet(pet);
                setScreen('chat');
              }}
            >
              <View style={styles.petHeader}>
                <Text style={styles.petEmoji}>{pet.emoji}</Text>
                <View style={styles.petIdentity}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petMeta}>{pet.type} • {pet.age}</Text>
                </View>
              </View>

              <View style={styles.tagRow}>
                <Text style={styles.tag}>{pet.size}</Text>
                <Text style={styles.tag}>{pet.energy}</Text>
                <Text style={styles.tag}>{pet.kids ? 'Amigável com crianças' : 'Mais reservado'}</Text>
              </View>

              <Text style={styles.petDescription}>{pet.description}</Text>
              <Text style={styles.ngoText}>{pet.ngo}</Text>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderChatScreen = () => (
    <View style={styles.chatScreen}>
      <View style={styles.chatHeader}>
        <Pressable onPress={() => setScreen('home')}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <View style={styles.chatTitleWrap}>
          <Text style={styles.chatEmoji}>{selectedPet.emoji}</Text>
          <Text style={styles.chatName}>{selectedPet.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {chatMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userBubble : styles.ongBubble,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.chatInputRow}>
        <TextInput
          style={styles.chatInput}
          placeholder="Escreva sua mensagem..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <Pressable style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </Pressable>
      </View>
    </View>
  );

  if (screen === 'register') {
    return renderRegisterScreen();
  }

  if (screen === 'home') {
    return renderHomeScreen();
  }

  if (screen === 'chat') {
    return renderChatScreen();
  }

  return renderLoginScreen();
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFF8F3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF8F3',
  },
  logoCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  registerCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 22,
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryText: {
    marginTop: 18,
    color: '#4B5563',
    textAlign: 'center',
  },
  linkText: {
    color: '#F97316',
    fontWeight: '700',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  homeContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 16,
    color: '#F97316',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 28,
    color: '#1F2937',
    fontWeight: '800',
  },
  avatarButton: {
    backgroundColor: '#FDE68A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  avatarText: {
    fontWeight: '700',
    color: '#7C2D12',
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#FDBA74',
  },
  chipText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#7C2D12',
  },
  petList: {
    gap: 14,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petEmoji: {
    fontSize: 42,
    marginRight: 12,
  },
  petIdentity: {
    flex: 1,
  },
  petName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  petMeta: {
    color: '#6B7280',
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#FDE68A',
    color: '#7C2D12',
    fontWeight: '700',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 11,
  },
  petDescription: {
    color: '#4B5563',
    lineHeight: 20,
  },
  ngoText: {
    marginTop: 12,
    color: '#F97316',
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
  },
  emptyText: {
    marginTop: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
  chatScreen: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backText: {
    color: '#F97316',
    fontWeight: '700',
    fontSize: 16,
  },
  chatTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatEmoji: {
    fontSize: 26,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FDBA74',
  },
  ongBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
  },
  chatInputRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  chatInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
