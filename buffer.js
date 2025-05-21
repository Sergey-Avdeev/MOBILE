import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {  SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, } from 'react-native';

export default (props) => {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView  style={styles.scrollView}>
				<View style={styles.row}>
					<View style={styles.column}>
						<View style={styles.box}>
						</View>
						<View style={styles.box}>
						</View>
						<View style={styles.box2}>
						</View>
					</View>
					<Text style={styles.text}>
						{"Избранное"}
					</Text>
					<View style={styles.box3}>
					</View>
				</View>
				<TouchableOpacity style={styles.button} onPress={()=>alert('Нажато')}>
					<Text style={styles.text2}>
						{"Событие"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={()=>alert('Pressed!')}>
					<Text style={styles.text2}>
						{"Событие"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button2} onPress={()=>alert('Pressed!')}>
					<Text style={styles.text2}>
						{"Событие"}
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	box: {
		width: 35,
		height: 6,
		backgroundColor: "#9D61FF",
		borderRadius: 29,
		marginBottom: 6,
	},
	box2: {
		width: 35,
		height: 6,
		backgroundColor: "#9D61FF",
		borderRadius: 29,
	},
	box3: {
		width: 35,
		height: 30,
	},
	button: {
		alignItems: "center",
		backgroundColor: "#9D61FF",
		borderColor: "#9D61FF",
		borderRadius: 80,
		borderWidth: 3,
		paddingVertical: 19,
		marginBottom: 14,
		marginHorizontal: 25,
	},
	button2: {
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderColor: "#9D61FF",
		borderRadius: 80,
		borderWidth: 3,
		paddingVertical: 19,
		marginBottom: 531,
		marginHorizontal: 25,
	},
	column: {
		alignItems: "center",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 78,
		marginBottom: 14,
		marginHorizontal: 25,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FFFCFC",
	},
	text: {
		color: "#000000",
		fontSize: 21,
		fontWeight: "bold",
		marginVertical: 8,
	},
	text2: {
		color: "#000000",
		fontSize: 21,
		fontWeight: "bold",
	},
});






----------------------------------------------------/

import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';

export default () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setTitle('');
    setDescription('');
    setModalVisible(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название события не может быть пустым');
      return;
    }

    if (currentEvent) {
      // Редактирование существующего события
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, title, description } : event
      ));
    } else {
      // Добавление нового события
      setEvents([...events, {
        id: Date.now().toString(),
        title,
        description
      }]);
    }
    setModalVisible(false);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setModalVisible(true);
  };

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Удалить событие',
      'Вы уверены, что хотите удалить это событие?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {
          setEvents(events.filter(event => event.id !== id));
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>События</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Нет событий</Text>
            <Text style={styles.emptySubtext}>Нажмите + чтобы добавить новое событие</Text>
          </View>
        ) : (
          events.map(event => (
            <View key={event.id} style={styles.eventContainer}>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
              </View>
              <View style={styles.eventActions}>
                <TouchableOpacity onPress={() => handleEditEvent(event)}>
                  <Text style={styles.actionText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteEvent(event.id)}>
                  <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Модальное окно для создания/редактирования события */}
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
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  headerText: {
	marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#9D61FF',
	marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 30,
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
  },
  eventContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionText: {
    fontSize: 20,
    marginLeft: 10,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
});



------------------------------------------------/
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';

export default () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredEvents = showFavorites 
    ? events.filter(event => event.favorite) 
    : events;

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setTitle('');
    setDescription('');
    setModalVisible(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название события не может быть пустым');
      return;
    }

    if (currentEvent) {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, title, description } : event
      ));
    } else {
      setEvents([...events, {
        id: Date.now().toString(),
        title,
        description,
        favorite: false
      }]);
    }
    setModalVisible(false);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setModalVisible(true);
  };

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Удалить событие',
      'Вы уверены, что хотите удалить это событие?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {
          setEvents(events.filter(event => event.id !== id));
        }}
      ]
    );
  };

  const toggleFavorite = (id) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, favorite: !event.favorite } : event
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.favoriteHeaderButton}
            onPress={() => setShowFavorites(true)}
          >
            <Text style={[styles.favoriteIcon, showFavorites && styles.favoriteActive]}>★</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setShowFavorites(false)}>
            <Text style={styles.headerTitle}>Все события</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {showFavorites ? 'Нет избранных событий' : 'Нет событий'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavorites ? '' : 'Нажмите + чтобы добавить новое событие'}
            </Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <View key={event.id} style={styles.eventContainer}>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(event.id)}
              >
                <Text style={[styles.favoriteIcon, event.favorite && styles.favoriteActive]}>
                  {event.favorite ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
              </View>
              
              <View style={styles.eventActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditEvent(event)}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteEvent(event.id)}
                >
                  <Text style={styles.actionIcon}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

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
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40, // Увеличенный отступ сверху
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  favoriteHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#9D61FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 30,
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
  },
  eventContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    marginRight: 10,
  },
  favoriteIcon: {
    fontSize: 24,
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
  },
  eventActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionIcon: {
    color: '#fff',
    fontSize: 16,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
});






---------------------------------------------------------------------------/
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';

export default () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredEvents = showFavorites 
    ? events.filter(event => event.favorite) 
    : events;

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setTitle('');
    setDescription('');
    setModalVisible(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название события не может быть пустым');
      return;
    }

    if (currentEvent) {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, title, description } : event
      ));
    } else {
      setEvents([...events, {
        id: Date.now().toString(),
        title,
        description,
        favorite: false
      }]);
    }
    setModalVisible(false);
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

  const handleUpdateDescription = () => {
    setEvents(events.map(event => 
      event.id === currentEvent.id ? { ...event, description } : event
    ));
    setDetailModalVisible(false);
  };

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Удалить событие',
      'Вы уверены, что хотите удалить это событие?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {
          setEvents(events.filter(event => event.id !== id));
          setDetailModalVisible(false);
        }}
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
          <TouchableOpacity 
            style={styles.favoriteHeaderButton}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <View style={styles.favoriteCircle}>
              <Text style={[styles.favoriteIcon, showFavorites && styles.favoriteActive]}>★</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            {showFavorites ? 'Избранные события' : 'Все события'}
          </Text>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {showFavorites ? 'Нет избранных событий' : 'Нет событий'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavorites ? '' : 'Нажмите + чтобы добавить новое событие'}
            </Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventContainer}
              onPress={() => handleShowDetails(event)}
            >
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
              </View>
              
              <View style={styles.eventActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event);
                  }}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for adding/editing events */}
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
            
            <TextInput
              style={[styles.input, styles.detailDescriptionInput]}
              placeholder="Описание события"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            
            <View style={styles.detailModalButtons}>
              <TouchableOpacity 
                style={[styles.detailModalButton, styles.deleteDetailButton]}
                onPress={() => handleDeleteEvent(currentEvent?.id)}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
              
              <View style={styles.detailRightButtons}>
                <TouchableOpacity 
                  style={[styles.detailModalButton, styles.cancelDetailButton]}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.cancelDetailButtonText}>Отмена</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.detailModalButton, styles.saveDetailButton]}
                  onPress={handleUpdateDescription}
                >
                  <Text style={styles.saveDetailButtonText}>Сохранить</Text>
                </TouchableOpacity>
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
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  favoriteHeaderButton: {
    marginRight: 10,
  },
  favoriteCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#9D61FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 30,
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
  },
  eventContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    marginRight: 10,
  },
  favoriteIcon: {
    fontSize: 24,
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
  },
  eventActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionIcon: {
    color: '#fff',
    fontSize: 16,
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#9D61FF',
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

--------------------------------------------------------------------------/
import React, { useState, createContext, useContext } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, StatusBar } from 'react-native';

// Контекст для аутентификации
const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);

  const loginAsAdmin = () => {
    setUser({ role: 'admin' });
  };

  const loginAsVisitor = () => {
    setUser({ role: 'visitor' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
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
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredEvents = showFavorites 
    ? events.filter(event => event.favorite) 
    : events;

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setTitle('');
    setDescription('');
    setModalVisible(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название события не может быть пустым');
      return;
    }

    if (currentEvent) {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, title, description } : event
      ));
    } else {
      setEvents([...events, {
        id: Date.now().toString(),
        title,
        description,
        favorite: false,
        createdAt: new Date().toISOString()
      }]);
    }
    setModalVisible(false);
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

  const handleUpdateDescription = () => {
    if (user.role === 'admin') {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, description } : event
      ));
    }
    setDetailModalVisible(false);
  };

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Удалить событие',
      'Вы уверены, что хотите удалить это событие?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {
          setEvents(events.filter(event => event.id !== id));
          setDetailModalVisible(false);
        }}
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
          <TouchableOpacity 
            style={styles.favoriteHeaderButton}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <View style={styles.favoriteCircle}>
              <Text style={[styles.favoriteIcon, showFavorites && styles.favoriteActive]}>★</Text>
            </View>
          </TouchableOpacity>
          
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

        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {showFavorites ? 'Нет избранных событий' : 'Нет событий'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavorites ? '' : (user.role === 'admin' ? 'Нажмите + чтобы добавить новое событие' : 'Ожидайте добавления событий администратором')}
            </Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventContainer}
              onPress={() => handleShowDetails(event)}
            >
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
              
              {user.role === 'admin' && (
                <View style={styles.eventActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event);
                    }}
                  >
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    borderRadius: 8,
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
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  favoriteHeaderButton: {
    marginRight: 10,
  },
  favoriteCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
    borderRadius: 5,
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
  },
  favoriteButton: {
    marginRight: 10,
  },
  favoriteIcon: {
    fontSize: 24,
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
  eventActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionIcon: {
    color: '#fff',
    fontSize: 16,
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


--------------------------------------------------------------/
import React, { useState, createContext, useContext } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, StatusBar } from 'react-native';

// Контекст для аутентификации
const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);

  const loginAsAdmin = () => {
    setUser({ role: 'admin' });
  };

  const loginAsVisitor = () => {
    setUser({ role: 'visitor' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
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
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredEvents = showFavorites 
    ? events.filter(event => event.favorite) 
    : events;

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setTitle('');
    setDescription('');
    setModalVisible(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название события не может быть пустым');
      return;
    }

    if (currentEvent) {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, title, description } : event
      ));
    } else {
      setEvents([...events, {
        id: Date.now().toString(),
        title,
        description,
        favorite: false,
        createdAt: new Date().toISOString()
      }]);
    }
    setModalVisible(false);
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

  const handleUpdateDescription = () => {
    if (user.role === 'admin') {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, description } : event
      ));
    }
    setDetailModalVisible(false);
  };

  const handleDeleteEvent = (id) => {
    Alert.alert(
      'Удалить событие',
      'Вы уверены, что хотите удалить это событие?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {
          setEvents(events.filter(event => event.id !== id));
          setDetailModalVisible(false);
        }}
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
          <TouchableOpacity 
            style={styles.favoriteHeaderButton}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <View style={styles.favoriteCircle}>
              <Text style={[styles.favoriteIcon, showFavorites && styles.favoriteActive]}>★</Text>
            </View>
          </TouchableOpacity>
          
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

        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {showFavorites ? 'Нет избранных событий' : 'Нет событий'}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavorites ? '' : (user.role === 'admin' ? 'Нажмите + чтобы добавить новое событие' : 'Ожидайте добавления событий администратором')}
            </Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventContainer}
              onPress={() => handleShowDetails(event)}
            >
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
              
              {user.role === 'admin' && (
                <View style={styles.eventActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event);
                    }}
                  >
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    borderRadius: 8,
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
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  favoriteHeaderButton: {
    marginRight: 10,
  },
  favoriteCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
    borderRadius: 5,
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
  },
  favoriteButton: {
    marginRight: 10,
  },
  favoriteIcon: {
    fontSize: 24,
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
  eventActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionIcon: {
    color: '#fff',
    fontSize: 16,
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