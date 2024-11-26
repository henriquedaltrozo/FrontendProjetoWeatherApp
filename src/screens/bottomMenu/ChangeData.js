import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Alert,
} from 'react-native';
import {Button, Text, Icon} from 'react-native-elements';
import {TextInputMask} from 'react-native-masked-text';
import LinearGradient from 'react-native-linear-gradient';
import userService from '../../services/UserService';

export default function ChangeData({navigation}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const updateData = async () => {
    const data = {
      nome,
      email,
      telefone,
      senha,
    };

    try {
      const response = await userService.update(data);
      Alert.alert(
        'Sucesso',
        response.data.mensagem || 'Dados atualizados com sucesso',
      );
    } catch (error) {
      console.error(
        'Erro ao atualizar:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Erro',
        error.response?.data?.mensagem || 'Erro ao atualizar dados',
      );
    }
  };

  return (
    <LinearGradient
      colors={['#052e3f', '#125a79', '#052e3f']}
      locations={[0, 0.5, 1]}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}>
        <ScrollView style={styles.scrollStyle}>
          <Text style={styles.textTop}>Alterar Dados</Text>

          <View style={styles.containerMask}>
            <Icon name="user" type="font-awesome" color="#fff" />
            <TextInputMask
              type={'custom'}
              options={{
                mask: '*'.repeat(50),
                translation: {
                  S: {pattern: /[a-zA-Z\u00C0-\u017F\s]/},
                },
              }}
              placeholder="Novo Nome"
              placeholderTextColor="#fff"
              value={nome}
              onChangeText={setNome}
              style={styles.maskedInput}
            />
          </View>

          <View style={styles.containerMask}>
            <Icon name="envelope" type="font-awesome" color="#fff" />
            <TextInputMask
              placeholder="Novo E-mail"
              placeholderTextColor="#fff"
              type={'custom'}
              options={{
                mask: '*'.repeat(50),
              }}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.maskedInput}
            />
          </View>

          <View style={styles.containerMask}>
            <Icon name="phone" type="font-awesome" color="#fff" />
            <TextInputMask
              placeholder="Novo Telefone"
              placeholderTextColor="#fff"
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) ',
              }}
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              style={styles.maskedInput}
            />
          </View>

          <View style={styles.containerMask}>
            <Icon name="lock" type="font-awesome" color="#fff" />
            <TextInputMask
              placeholder="Nova Senha"
              placeholderTextColor="#fff"
              type={'custom'}
              options={{
                mask: '*'.repeat(20),
              }}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={true}
              style={styles.maskedInput}
            />
          </View>

          <Button
            title="Salvar"
            buttonStyle={styles.buttonSave}
            titleStyle={styles.buttonSaveText}
            onPress={updateData}
          />

          <Button
            title="Voltar"
            buttonStyle={styles.buttonBack}
            titleStyle={styles.buttonBackText}
            onPress={() => navigation.goBack()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  textTop: {
    fontSize: 24,
    marginTop: 80,
    marginBottom: 30,
    paddingLeft: 4,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  maskedInput: {
    flex: 1,
    fontSize: 18,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    color: '#fff',
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
  },
  containerMask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  scrollStyle: {width: '90%', marginTop: 10},
  buttonSave: {
    marginTop: 10,
    paddingHorizontal: 140,
    paddingVertical: 5,
    backgroundColor: '#28a745',
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonSaveText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  buttonBack: {
    marginTop: 10,
    paddingHorizontal: 140,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonBackText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Montserrat-Bold',
  },
});
