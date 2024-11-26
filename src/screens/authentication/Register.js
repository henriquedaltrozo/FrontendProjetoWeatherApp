import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { Button, CheckBox, Text, Icon } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import LinearGradient from 'react-native-linear-gradient';
import userService from '../../services/UserService';

export default function Register({ navigation }) {
  const [email, setEmail] = useState(null);
  const [nome, setNome] = useState(null);
  const [senha, setSenha] = useState(null);
  const [telefone, setTelefone] = useState(null);
  const [isSelected, setSelected] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorNome, setErrorNome] = useState(null);
  const [errorTelefone, setErrorTelefone] = useState(null);
  const [errorSenha, setErrorSenha] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  let telefoneField = null;

  const validateEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const validar = () => {
    let error = false;
    setErrorEmail(null);
    setErrorNome(null);
    setErrorTelefone(null);
    setErrorSenha(null);

    if (!validateEmail.test(String(email).toLowerCase())) {
      setErrorEmail('Preencha seu email corretamente.');
      error = true;
    }
    if (nome == null) {
      setErrorNome('Preencha seu nome completo corretamente.');
      error = true;
    }
    if (!telefoneField?.isValid()) {
      setErrorTelefone('Preencha seu telefone corretamente.');
      error = true;
    }
    if (senha == null) {
      setErrorSenha('Preencha a senha.');
      error = true;
    }
    return !error;
  };

  const salvar = () => {
    if (validar()) {
      setLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const data = {
        email,
        nome,
        telefone,
        senha,
      };

      userService
        .register(data)
        .then((response) => {
          setLoading(false);
          if (response.data.status) {
            setSuccessMessage(response.data.mensagem);
            setTimeout(() => {
              navigation.navigate('Login'); // Navega após um curto intervalo
            }, 2000);
          } else {
            setErrorMessage(response.data.mensagem || 'Erro ao cadastrar.');
          }
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage(
            error.response?.data?.mensagem || 'Erro inesperado ao cadastrar.'
          );
        });
    }
  };

  const backToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#052e3f', '#125a79', '#052e3f']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <ScrollView style={styles.scrollStyle}>
          <Text style={styles.textTop}> Novo Usuário </Text>

          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <View style={styles.containerMask}>
            <Icon name="envelope" type="font-awesome" color="#fff" />
            <TextInputMask
              placeholder="Digite seu e-mail"
              placeholderTextColor="#fff"
              type={'custom'}
              options={{
                mask: '*'.repeat(50),
              }}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setErrorEmail(null);
              }}
              keyboardType="email-address"
              style={styles.maskedInput}
            />
          </View>
          <Text style={styles.errorMessage}>{errorEmail}</Text>

          <View style={styles.containerMask}>
            <Icon name="user" type="font-awesome" color="#fff" />
            <TextInputMask
              type={'custom'}
              options={{
                mask: '*'.repeat(50),
                translation: {
                  S: { pattern: /[a-zA-Z\u00C0-\u017F\s]/ },
                },
              }}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#fff"
              value={nome}
              onChangeText={(value) => {
                setNome(value);
                setErrorNome(null);
              }}
              style={styles.maskedInput}
            />
          </View>

          <Text style={styles.errorMessage}>{errorNome}</Text>

          <View style={styles.containerMask}>
            <Icon name="phone" type="font-awesome" color="#fff" />
            <TextInputMask
              placeholder="Digite seu telefone"
              placeholderTextColor="#fff"
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) ',
              }}
              value={telefone}
              onChangeText={(value) => {
                setTelefone(value);
                setErrorTelefone(null);
              }}
              keyboardType="phone-pad"
              style={styles.maskedInput}
              ref={(ref) => (telefoneField = ref)}
            />
          </View>
          <Text style={styles.errorMessage}>{errorTelefone}</Text>

          <View style={styles.containerMask}>
            <Icon name="lock" type="font-awesome" color="#fff" />
            <TextInputMask
              placeholder="Digite sua senha"
              placeholderTextColor="#fff"
              type={'custom'}
              options={{
                mask: '*'.repeat(20),
              }}
              value={senha}
              onChangeText={(value) => {
                setSenha(value);
                setErrorSenha(null);
              }}
              secureTextEntry={true}
              style={styles.maskedInput}
            />
          </View>
          <Text style={styles.errorMessage}>{errorSenha}</Text>

          <CheckBox
            title="Eu aceito os termos de uso."
            checkedIcon="check"
            uncheckedIcon="square-o"
            checkedColor="green"
            uncheckedColor="red"
            checked={isSelected}
            onPress={() => setSelected(!isSelected)}
            textStyle={styles.checkBoxText}
            containerStyle={styles.checkBoxContainer}
          />

          {isLoading && <Text style={styles.loadingText}>Carregando...</Text>}

          {!isLoading && (
            <>
              <Button
                title="Salvar"
                buttonStyle={styles.buttonSave}
                titleStyle={styles.buttonSaveText}
                onPress={() => salvar()}
              />

              <Button
                title="Voltar"
                buttonStyle={styles.buttonBack}
                titleStyle={styles.buttonBackText}
                onPress={() => backToLogin()}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  textTop: {
    fontSize: 24,
    marginTop: 80,
    marginBottom: 40,
    paddingLeft: 4,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  maskedInput: {
    flex: 1,
    fontSize: 18,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    marginLeft: 10,
  },
  containerMask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  errorMessage: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    color: '#f00',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  successText: {
    alignSelf: 'center',
    color: '#28a745',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 15,
  },
  checkBoxText: {
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderColor: '#fff',
    marginTop: 35,
    marginBottom: 30,
  },
  buttonSave: {
    marginTop: 45,
    paddingHorizontal: 140,
    paddingVertical: 5,
    backgroundColor: '#28a745',
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonSaveText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  buttonBack: {
    marginTop: 10,
    paddingHorizontal: 140,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonBackText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#000',
  },
});
