import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import userService from '../../services/UserService';

const Profile = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(require('../../../assets/default-user.png'));
  const [nome, setNome] = useState('');

  const carregarDadosUsuario = async () => {
    try {
      const { data } = await userService.getData();
      setNome(data.nome);
    } catch (error) {
      console.error('Erro ao carregar os dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
    }
  };

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          Alert.alert('Cancelado', 'Nenhuma imagem foi selecionada.');
        } else if (response.errorCode) {
          Alert.alert('Erro', 'Erro ao acessar a galeria.');
        } else {
          const uri = response.assets[0].uri;
          setProfileImage({ uri });
        }
      }
    );
  };

  return (
    <LinearGradient
      colors={['#052e3f', '#125a79', '#052e3f']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.profileSection}>
        <Image
          source={profileImage}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={selectImage}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.greeting}>Olá, {nome || 'Usuário'}!</Text>
      <Button
        title="Alterar Dados"
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={() => navigation.navigate('ChangeData')}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 50,
    marginBottom: 60,
    fontFamily: 'Montserrat-Bold',
  },
  profileSection: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 4,
  },
  greeting: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    fontFamily: 'Montserrat-Regular',
  },
  details: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 35,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Montserrat-Bold',
  },
});

export default Profile;
