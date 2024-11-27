import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Home = ({navigation, route}) => {
  const {city} = route.params || {city: 'Ijui'};
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);

      const [cityName, countryCode] = city.includes(' - ')
        ? city.split(' - ')
        : [city, null];
      const query = countryCode
        ? `${cityName.trim()},${countryCode.trim()}`
        : cityName.trim();

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&lang=pt_br&appid=f068217c770fb057c6b31b1b1812ed9e`,
      );
      const data = await response.json();

      if (data.cod !== '200' || !data.list || data.list.length === 0) {
        throw new Error('Cidade não encontrada ou sem dados disponíveis.');
      }

      const now = new Date();
      const currentHour = now.getHours();

      const closestWeather = data.list.reduce((closest, item) => {
        const forecastDate = new Date(item.dt_txt);
        const diff = Math.abs(now - forecastDate);
        return diff < Math.abs(now - new Date(closest.dt_txt)) ? item : closest;
      }, data.list[0]);

      const dailyForecast = [];
      const groupedByDay = {};

      data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const forecastHour = new Date(item.dt_txt).getHours();

        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push({
          ...item,
          hourDiff: Math.abs(currentHour - forecastHour),
        });
      });

      Object.keys(groupedByDay).forEach(date => {
        const closestForDay = groupedByDay[date].reduce((closest, item) =>
          item.hourDiff < closest.hourDiff ? item : closest,
        );
        dailyForecast.push(closestForDay);
      });

      setWeatherData(data.city);
      setCurrentWeather(closestWeather);
      setForecastData(dailyForecast.slice(1, 4));
    } catch (error) {
      console.error('Erro ao buscar dados climáticos:', error.message);
      Alert.alert(
        'Erro',
        'Não foi possível buscar os dados climáticos. Verifique se a cidade está correta e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    return `Dia ${day}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!weatherData || !currentWeather || forecastData.length === 0) {
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
      <View style={styles.weatherContainer}>
        <Text style={styles.city}>{weatherData.name}</Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
          }}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperature}>
          {Math.round(currentWeather.main.temp)}°C
        </Text>
        <Text style={styles.description}>
          {currentWeather.weather[0].description}
        </Text>
      </View>
      <Text style={styles.subtitle}>Próximos dias:</Text>
      <View style={styles.forecastList}>
        <FlatList
          data={forecastData}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({item}) => (
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastDate}>{formatDate(item.dt_txt)}</Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }}
                style={styles.forecastIcon}
              />
              <Text style={styles.forecastTemp}>
                {Math.round(item.main.temp)}°C
              </Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ForecastDetails', {city})}>
        <Text style={styles.buttonText}>Ver previsão completa</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  weatherContainer: {
    alignItems: 'center',
  },
  city: {
    fontSize: 45,
    color: '#fff',
    marginBottom: 10,
    marginTop: 60,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 60,
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'Montserrat-Bold',
  },
  description: {
    fontSize: 20,
    color: '#fff',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat-Medium',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    alignSelf: 'center',
    marginVertical: 20,
    fontFamily: 'Montserrat-Bold',
    marginTop: 40,
  },
  forecastList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  forecastDate: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  forecastTemp: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 60,
    marginBottom: 110,
    alignSelf: 'center',
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

export default Home;
