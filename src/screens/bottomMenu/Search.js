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
  const [suggestions, setSuggestions] = useState([]);

  const fetchCityWeather = async (query) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=f068217c770fb057c6b31b1b1812ed9e&units=metric&lang=pt`
      );
      const data = await response.json();

      if (data.cod === 200) {
        const newCity = {
          id: data.id,
          name: `${data.name} - ${data.sys.country}`,
          favorited: false,
        };

        setCities((prevCities) => {
          const existingCity = prevCities.find((city) => city.id === newCity.id);

          if (existingCity) {
            if (existingCity.favorited) {
              Alert.alert(
                'Aviso',
                'Essa cidade já está na lista.'
              );
              return prevCities;
            } else {
              return prevCities.map((city) =>
                city.id === newCity.id ? { ...city, favorited: false } : city
              );
            }
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

  const fetchSuggestions = async (query) => {
    if (query.trim().length < 3) {
      setSuggestions([]); // Limpa sugestões se o texto for muito curto
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=f068217c770fb057c6b31b1b1812ed9e&units=metric&lang=pt`
      );
      const data = await response.json();

      if (data.cod === '200') {
        const citySuggestions = data.list.map((city) => ({
          id: city.id,
          name: `${city.name} - ${city.sys.country}`,
        }));
        setSuggestions(citySuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSuggestions([]);
    }
  };

  const handleSearchInput = (text) => {
    setSearch(text);
    fetchSuggestions(text);
  };

  const handleSuggestionPress = (cityNameWithCountry) => {
    const [cityName, countryCode] = cityNameWithCountry.split(' - ');
    setSearch(cityNameWithCountry);
    fetchCityWeather(`${cityName},${countryCode}`);
    setSuggestions([]);
  };

  const toggleFavorite = (cityId) => {
    setCities((prevCities) => {
      const updatedCities = prevCities.map((city) =>
        city.id === cityId ? { ...city, favorited: !city.favorited } : city
      );
      return updatedCities.sort((a, b) => b.favorited - a.favorited);
    });
  };

  const clearNonFavoriteCities = () => {
    setCities((prevCities) => prevCities.filter((city) => city.favorited));
  };

  const renderCity = ({ item }) => (
    <View style={styles.cityContainer}>
      <TouchableOpacity
        style={styles.cityInfo}
        onPress={() => navigation.navigate('Home', { city: item.name })}>
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

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item.name)}>
      <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
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
          onChangeText={handleSearchInput}
        />
        <TouchableOpacity onPress={() => fetchCityWeather(search)} style={styles.searchButton}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSuggestion}
        style={styles.suggestionList}
        ListEmptyComponent={<Text style={styles.emptyText}>Sem sugestões.</Text>}
      />

      <TouchableOpacity
        onPress={clearNonFavoriteCities}
        style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Apagar não favoritos</Text>
      </TouchableOpacity>

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
    marginBottom: 10,
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
  suggestionList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 5,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  clearButton: {
    paddingVertical: 10,
    alignItems: 'flex-end',
    marginHorizontal: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
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
    fontSize: 15,
    marginTop: 20,
    fontFamily: 'Montserrat-Regular',
  },
});

export default Search;
