import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const Search = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);

  const fetchCityWeather = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=f068217c770fb057c6b31b1b1812ed9e&units=metric&lang=pt`
      );
      const data = await response.json();

      if (data.cod === 200) {
        const newCity = {
          id: data.id,
          name: `${data.name} - ${data.sys.country}`,
          favorited: true,
        };

        setCities((prevCities) => {
          if (prevCities.some((city) => city.id === newCity.id)) {
            Alert.alert('Aviso', 'Essa cidade já está na lista de favoritos.');
            return prevCities;
          }
          return [...prevCities, newCity];
        });
      } else {
        Alert.alert('Erro', 'Cidade não encontrada. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados da cidade:', error);
      Alert.alert('Erro', 'Não foi possível buscar os dados da cidade.');
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      fetchCityWeather(search.trim());
      setSearch('');
    } else {
      Alert.alert('Aviso', 'Digite o nome de uma cidade.');
    }
  };

  const navigateToCity = (city) => {
    const cityName = city.split(' - ')[0];
    navigation.navigate('Home', { city: cityName });
  };

  const toggleFavorite = (cityId) => {
    setCities((prevCities) => prevCities.filter((city) => city.id !== cityId));
  };

  const renderCity = ({ item }) => (
    <View style={styles.cityContainer}>
      <TouchableOpacity
        style={styles.cityInfo}
        onPress={() => navigateToCity(item.name)}>
        <Icon name="map-marker" size={20} color="#fff" />
        <Text style={styles.cityName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <Icon
          name={item.favorited ? 'star' : 'star-o'}
          size={20}
          color={item.favorited ? '#FFD700' : '#fff'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#052e3f', '#125a79', '#052e3f']}
      locations={[0, 0.5, 1]}
      style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar Cidade"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCity}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma cidade favoritada.</Text>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 25,
    marginTop: 55,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  searchButton: {
    marginLeft: 10,
  },
  listContainer: {
    marginTop: 10,
  },
  cityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'Montserrat-Regular',
  },
});

export default Search;
