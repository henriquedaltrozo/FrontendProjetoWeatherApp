import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ForecastDetails = ({ navigation, route }) => {
  const { city } = route.params || { city: 'Ijui' };
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForecast = useCallback(async () => {
    try {
      setLoading(true);

      const [cityName, countryCode] = city.split(' - ') || [city, null];
      const query = countryCode
        ? `${cityName.trim()},${countryCode.trim()}`
        : cityName.trim();

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&lang=pt_br&appid=f068217c770fb057c6b31b1b1812ed9e`
      );
      const data = await response.json();

      if (data.cod !== '200' || !data.list || data.list.length === 0) {
        throw new Error(
          `Dados climáticos não disponíveis para a cidade: ${city}`
        );
      }

      const dailyData = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
          dailyData[date] = {
            temps: [],
            weather: item.weather[0],
            wind: item.wind.speed,
            humidity: item.main.humidity,
            pop: item.pop || 0,
          };
        }
        dailyData[date].temps.push(item.main.temp);
      });

      const dailyForecast = Object.keys(dailyData).map((date) => {
        const temps = dailyData[date].temps;
        return {
          date,
          temp_max: Math.max(...temps),
          temp_min: Math.min(...temps),
          weather: dailyData[date].weather,
          wind: dailyData[date].wind,
          humidity: dailyData[date].humidity,
          pop: dailyData[date].pop,
        };
      });

      setForecastData(dailyForecast.slice(0, 5));
    } catch (error) {
      console.error('Erro ao buscar dados climáticos:', error.message);
      Alert.alert(
        'Erro',
        `Não foi possível buscar os dados climáticos. Cidade: ${city}. Verifique se a cidade está correta e tente novamente.`
      );
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (forecastData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar dados climáticos.</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#052e3f', '#125a79', '#052e3f']}
      locations={[0, 0.5, 1]}
      style={styles.container}>
      <Text style={styles.title}>Previsão para 5 dias</Text>
      <FlatList
        data={forecastData}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.day}>{formatDate(item.date)}</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather.icon}@2x.png`,
              }}
              style={styles.icon}
            />
            <Text style={styles.description}>{item.weather.description}</Text>
            <Text style={styles.tempMaxMin}>
              Máx: {Math.round(item.temp_max)}°C
            </Text>
            <Text style={styles.tempMaxMin}>
              Mín: {Math.round(item.temp_min)}°C
            </Text>
            <Text style={styles.details}>Umidade: {item.humidity}%</Text>
            <Text style={styles.details}>Vento: {item.wind} km/h</Text>
            <Text style={styles.details}>
              Probabilidade de Chuva: {Math.round(item.pop * 100)}%
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar para Home</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 130,
    marginTop: 80,
    fontFamily: 'Montserrat-Bold',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    width: 150,
    height: 300,
  },
  day: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  tempMaxMin: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  details: {
    fontSize: 12,
    color: '#ddd',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 95,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Montserrat-Bold',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    fontFamily: 'Montserrat-Regular',
  },
});

export default ForecastDetails;
