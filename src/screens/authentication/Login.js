import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useCallback } from 'react';
import { Alert, StatusBar, StyleSheet, Image} from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import userService from '../../services/UserService';

export default function Login({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingToken, setLoadingToken] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const loginWithToken = useCallback(async () => {
    try {
      setLoadingToken(true);
      await userService.loginComToken();
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomMenu' }],
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      setLoadingToken(false);
      await AsyncStorage.removeItem('TOKEN');
      Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
    }
  }, [navigation]);

  const enter = () => {
    let data = {
      email: email,
      password: password,
    };

    setLoading(true);
    userService
      .login(data)
      .then(response => {
        const token = response.data?.access_token;
        if (token) {
          AsyncStorage.setItem('TOKEN', token).then(() => {
            setLoading(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomMenu' }],
            });
          });
        } else {
          setLoading(false);
          Alert.alert('Erro', 'Token não encontrado na resposta.');
        }
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage('Usuário ou senha inválidos.');
      });
  };

  useEffect(() => {
    const verificateToken = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        if (token) {
          console.log('Token encontrado:', token);
          await loginWithToken();
        } else {
          setLoadingToken(false);
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        setLoadingToken(false);
      }
    };

    verificateToken();
  }, [loginWithToken]);

  const register = () => {
    navigation.navigate('Register');
  };

  return (
    <LinearGradient
      colors={['#052e3f', '#125a79', '#052e3f']}
      locations={[0, 0.5, 1]}
      style={styles.container}>
      {isLoadingToken && <Text style={styles.loadingText}>Aguarde...</Text>}

      {!isLoadingToken && (
        <>
          <StatusBar barStyle="light-content" />

          <Image
            style={styles.logoImage}
            source={require('../../images/logo.png')}
          />

          <Text style={styles.loginTitle}>Entrar</Text>

          <Input
            placeholder="Digite seu e-mail"
            leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#fff', size: 21}}
            onChangeText={value => setEmail(value)}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#fff"
            containerStyle={styles.inputEmail}
            inputStyle={styles.inputText}
          />

          <Input
            placeholder="Digite sua senha"
            leftIcon={{ type: 'font-awesome', name: 'lock', color: '#fff', size: 30}}
            onChangeText={value => setPassword(value)}
            autoCapitalize="none"
            secureTextEntry
            placeholderTextColor="#fff"
            containerStyle={styles.inputPassword}
            inputStyle={styles.inputText}
          />

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {isLoading && <ActivityIndicator color="#fff" />}

          {!isLoading && (
            <Button
              title="Acessar"
              buttonStyle={styles.buttonSignIn}
              titleStyle={styles.buttonSignInText}
              onPress={enter}
            />
          )}

          <Text style={styles.bottomText}>OU</Text>

          <Button
            title="Cadastrar"
            buttonStyle={styles.buttonSignUp}
            titleStyle={styles.buttonSignUpText}
            onPress={register}
          />
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
  },
  logoImage: {
    height: 150,
    width: 260,
    margin: 30,
  },
  loginTitle: {
    color: '#fff',
    fontSize: 24,
    padding: 10,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 28,
    marginTop: 40,
  },
  inputEmail: {
    paddingRight: 40,
    paddingLeft: 40,
  },
  inputPassword: {
    paddingRight: 40,
    paddingLeft: 40,
    paddingBottom: 40,
  },
  inputText: {
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
  },
  buttonSignIn: {
    marginTop: 10,
    paddingHorizontal: 140,
    paddingVertical: 5,
    backgroundColor: '#28a745',
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonSignUp: {
    marginTop: 10,
    paddingHorizontal: 131,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonSignInText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  buttonSignUpText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  bottomText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  errorText: {
    color: '#f00',
    fontSize: 16,
    marginVertical: 10,
    fontFamily: 'Montserrat-Medium',
  },
});
