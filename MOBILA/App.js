import React, { useState, createContext, useContext, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Контекст для аутентификации
const AuthContext = createContext();

// Ключ для хранения событий
const EVENTS_STORAGE_KEY = 'EVENTS';

const App = () => {
  const [user, setUser] = useState(null);
  const [eventsData, setEventsData] = useState([]);

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (savedEvents) {
        setEventsData(JSON.parse(savedEvents));
      }
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
    }
  };

  const loginAsAdmin = () => {
    setUser({ role: 'admin' });
  };

  const loginAsVisitor = async () => {
    await loadEvents();
    setUser({ role: 'visitor' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, eventsData, setEventsData, loadEvents }}>
      {user ? (
        <EventApp />
      ) : (
        <LoginScreen loginAsAdmin={loginAsAdmin} loginAsVisitor={loginAsVisitor} />
      )}
    </AuthContext.Provider>
  );
};

const LoginScreen = ({ loginAsAdmin, loginAsVisitor }) => {
  return (
    <SafeAreaView style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Корпоративное приложение</Text>
      <View style={styles.loginButtons}>
        <TouchableOpacity style={[styles.loginButton, styles.adminButton]} onPress={loginAsAdmin}>
          <Text style={styles.loginButtonText}>Войти как Администратор</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.loginButton, styles.visitorButton]} onPress={loginAsVisitor}>
          <Text style={styles.loginButtonText}>Войти как Посетитель</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const EventApp = () => {
  const { user, logout, eventsData, setEventsData, loadEvents } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      setEvents(eventsData);
    } else {
      setEvents(eventsData);
    }
  }, [eventsData, user]);

  const filteredEvents = showFavorites 
    ? events.filter(event => event.favorite) 
    : events;

  const generateDemoEvents = async () => {
    const demoEvents = [
      {
        id: Date.now().toString(),
        title: 'Корпоративная вечеринка',
        description: 'Ежегодное празднование успехов компании с фуршетом и развлекательной программой.\n\nДата: 15 декабря\nМесто: Конференц-зал\nДресс-код: Вечерний',
        favorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: (Date.now() + 1).toString(),
        title: 'Тренинг по лидерству',
        description: 'Однодневный тренинг по развитию лидерских качеств для менеджеров среднего звена.\n\nТренер: Иван Петров\nПродолжительность: 6 часов\nНеобходима предварительная регистрация',
        favorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: (Date.now() + 2).toString(),
        title: 'Обновление ПО',
        description: 'Плановое обновление корпоративного программного обеспечения. Все сотрудники должны сохранить работу и выйти из систем до 18:00.\n\nОжидаемое время простоя: 2 часа\nОтветственный: IT-отдел',
        favorite: false,
        createdAt: new Date().toISOString()
      }
    ];

    try {
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(demoEvents));
      setEventsData(demoEvents);
      Alert.alert('Успех', 'Три демонстрационных события созданы');
    } catch (error) {
      console.error('Ошибка сохранения событий:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить события');
    }
  };

  const handleAddEvent = () => {
    generateDemoEvents();
  };

  const handleSaveEvent = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название события не может быть пустым');
      return;
    }

    let updatedEvents = [];
    if (currentEvent) {
      updatedEvents = events.map(event => 
        event.id === currentEvent.id ? { ...event, title, description } : event
      );
    } else {
      updatedEvents = [...events, {
        id: Date.now().toString(),
        title,
        description,
        favorite: false,
        createdAt: new Date().toISOString()
      }];
    }

    try {
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      setEventsData(updatedEvents);
      setModalVisible(false);
    } catch (error) {
      console.error('Ошибка сохранения событий:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить события');
    }
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setModalVisible(true);
  };

  const handleShowDetails = (event) => {
    setCurrentEvent(event);
    setDescription(event.description);
    setDetailModalVisible(true);
  };

  const handleUpdateDescription = async () => {
    if (user.role === 'admin') {
      const updatedEvents = events.map(event => 
        event.id === currentEvent.id ? { ...event, description } : event
      );
      
      try {
        await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
        setEventsData(updatedEvents);
      } catch (error) {
        console.error('Ошибка сохранения событий:', error);
        Alert.alert('Ошибка', 'Не удалось сохранить изменения');
      }
    }
    setDetailModalVisible(false);
  };

  const handleDeleteEvent = async (id) => {
    Alert.alert(
      'Удалить событие',
      'Вы уверены, что хотите удалить это событие?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive', 
          onPress: async () => {
            const updatedEvents = events.filter(event => event.id !== id);
            try {
              await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
              setEventsData(updatedEvents);
              setDetailModalVisible(false);
            } catch (error) {
              console.error('Ошибка удаления события:', error);
              Alert.alert('Ошибка', 'Не удалось удалить событие');
            }
          }
        }
      ]
    );
  };

  const toggleFavorite = (id) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, favorite: !event.favorite } : event
    ));
  };

  const getFirstLine = (text) => {
    if (!text) return '';
    return text.split('\n')[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {showFavorites ? 'Избранные события' : 'Все события'}
          </Text>
          
          <View style={styles.headerRight}>
            <Text style={styles.roleBadge}>
              {user.role === 'admin' ? 'Админ' : 'Посетитель'}
            </Text>
            {user.role === 'admin' && (
              <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.favoriteToggleButton}
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <Text style={[styles.favoriteIcon, showFavorites && styles.favoriteActive]}>
            {showFavorites ? '★ Показать все' : '★ Только избранные'}
          </Text>
        </TouchableOpacity>

        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {showFavorites ? 'Нет избранных событий' : 'Нет событий'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavorites ? '' : (user.role === 'admin' ? 'Нажмите + чтобы создать демо-события' : 'Ожидайте добавления событий администратором')}
            </Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventContainer}
              onPress={() => handleShowDetails(event)}
            >
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.description && (
                  <Text 
                    style={styles.eventDescription}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {getFirstLine(event.description)}
                  </Text>
                )}
                <Text style={styles.eventDate}>
                  {new Date(event.createdAt).toLocaleDateString()}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(event.id);
                }}
              >
                <Text style={[styles.favoriteIcon, event.favorite && styles.favoriteActive]}>
                  {event.favorite ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for adding/editing events (admin only) */}
      {user.role === 'admin' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {currentEvent ? 'Редактировать событие' : 'Новое событие'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Название события"
                value={title}
                onChangeText={setTitle}
              />
              
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Описание (необязательно)"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveEvent}
                >
                  <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for viewing event details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.detailModalContent}>
            <Text style={styles.detailModalTitle}>{currentEvent?.title}</Text>
            <Text style={styles.detailModalDate}>
              Создано: {new Date(currentEvent?.createdAt || new Date()).toLocaleString()}
            </Text>
            
            <TextInput
              style={[styles.input, styles.detailDescriptionInput]}
              placeholder="Описание события"
              value={description}
              onChangeText={setDescription}
              multiline
              editable={user.role === 'admin'}
            />
            
            <View style={styles.detailModalButtons}>
              {user.role === 'admin' && (
                <TouchableOpacity 
                  style={[styles.detailModalButton, styles.deleteDetailButton]}
                  onPress={() => handleDeleteEvent(currentEvent?.id)}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.detailRightButtons}>
                <TouchableOpacity 
                  style={[styles.detailModalButton, styles.cancelDetailButton]}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.cancelDetailButtonText}>Закрыть</Text>
                </TouchableOpacity>
                
                {user.role === 'admin' && (
                  <TouchableOpacity 
                    style={[styles.detailModalButton, styles.saveDetailButton]}
                    onPress={handleUpdateDescription}
                  >
                    <Text style={styles.saveDetailButtonText}>Сохранить</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  loginButtons: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    width: '80%',
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminButton: {
    backgroundColor: '#9D61FF',
  },
  visitorButton: {
    backgroundColor: '#4CAF50',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#9D61FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    alignItems: 'right'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 30,
  },
  favoriteToggleButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  eventContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    marginLeft: 10,
  },
  favoriteIcon: {
    fontSize: 30,
    color: '#D3D3D3',
  },
  favoriteActive: {
    color: '#9D61FF',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  detailModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#9D61FF',
  },
  detailModalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  detailDescriptionInput: {
    height: 200,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#9D61FF',
  },
  saveButtonText: {
    color: '#fff',
  },
  detailModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  detailModalButton: {
    borderRadius: 5,
    padding: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteDetailButton: {
    backgroundColor: '#F44336',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 20,
    color: '#fff',
  },
  cancelDetailButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  cancelDetailButtonText: {
    color: '#666',
  },
  saveDetailButton: {
    backgroundColor: '#9D61FF',
  },
  saveDetailButtonText: {
    color: '#fff',
  },
  detailRightButtons: {
    flexDirection: 'row',
  },
});

export default App;