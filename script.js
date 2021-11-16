// Composant prévision

const WeatherCard = {
  // Props que récupère le composant
  props: {
    Name: String,
    DateTime: String,
    TempMax: Number,
    TempMin: Number,
    WindSpeed: Number,
    Description: String,
    Icon: String,
  },

  // Contenu HTML de la carte météo
  template: `
    <div class="container">
      
      
      <p class="date">{{DateTime}}</p>
      <p>Temp. max : {{TempMax}} °C</p>
      <p> Temp. min : {{TempMin}} °C </p>
      <p>Vent : {{WindSpeed}} km/h</p>
      <p>Temps : {{Description}}</p>
      <img :src="'http://openweathermap.org/img/wn/' + Icon + '@2x.png'"/>
    </div>
  `,
};

// Composant racine
const RootComponent = {
  // Data properties qui permettent de récupérer des valeurs
  data() {
    return {
      weatherNice: [],
      weatherName: "",
      weatherIcon: "",
      inputLocation: "",
      weatherCity: [],
    };
  },

  // Appel du composant
  components: {
    WeatherCard: WeatherCard,
  },

  // Fonction appelée au montage de la page pour récupérer les données météo à Nice
  async mounted() {
    // Adresse de la requête
    const url =
      "https://api.openweathermap.org/data/2.5/forecast?q=Nice&appid=da4308537532e9b3bcd6a56b77f79df8&units=metric&lang=fr";

    console.log(url);

    // Envoi de la requête et attente de la reponse
    const response = await fetch(url);
    // Lecture du body de la requête
    const data = await response.json();
    console.log(data);

    // Assignation des données recus dans des datas Properties
    this.weatherNice = data.list;
    this.weatherName = data.city.name;

    console.log(this.weatherNice);
  },

  methods: {
    // Méthode appelée pour la géolocalisation
    getWeatherByLocation() {
      // Récupération des coordonnées et assignation dans des constantes
      navigator.geolocation.getCurrentPosition(async (position) => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;

        // Adresse de la requête
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=da4308537532e9b3bcd6a56b77f79df8&units=metric&lang=fr`;

        // Envoi de la requête et attente de la reponse
        const response = await fetch(url);
        // Lecture du body de la requête
        const data = await response.json();

        // Assignation des données recus dans des datas Properties
        this.weatherNice = data.list;
        this.weatherName = data.city.name;
      });
    },

    // Méthode appelée pour la météo dans toutes les villes saisies dans l'input
    async getWeatherByCity() {
      // Récupération de la valeur de l'input dnas une constante
      const inputLocationWorld = this.inputLocation;
      // Adresse de la requête
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputLocationWorld}&appid=da4308537532e9b3bcd6a56b77f79df8&units=metric&lang=fr`;

      console.log(url);

      // Envoi de la requête et attente de la reponse
      const response = await fetch(url);
      // Lecture du body de la requête
      const data = await response.json();
      console.log(data);

      // Assignation des données recus dans des datas Properties
      this.weatherCity = data.list;
      this.weatherCityName = data.city.name;
    },
  },

  template: `

        <header class="header">

        <h1>{{weatherName}} </h1>
        <button @click="getWeatherByLocation">La météo où je suis</button>
        </header>

    <div class="weatherCard-container">
      
      <WeatherCard v-for=" element in weatherNice"
      
      
      
        :DateTime = "element.dt_txt"
        :TempMax = "element.main.temp_max"
        :TempMin = "element.main.temp_min"
        :WindSpeed = "element.wind.speed"
        :Description = "element.weather[0].description"
        :Icon = "element.weather[0].icon"
        
        />
      
    </div>


     
  
    
  
  <h1 class="inputLocation">{{inputLocation}} </h1>
      
    <div class="weatherCard-container">
      

      <WeatherCard v-for=" element in weatherCity"
      
      
        :DateTime = "element.dt_txt"
        :TempMax = "element.main.temp_max"
        :TempMin = "element.main.temp_min"
        :WindSpeed = "element.wind.speed"
        :Description = "element.weather[0].description"
        :Icon = "element.weather[0].icon"
        
        />
      
    </div>

    <div class="search">
    <input type="text" placeholder="Chercher la météo de quelle ville ?" v-model="inputLocation" @keyup.enter="getWeatherByCity"/><br>
    <button @click="getWeatherByCity">Valider</button>
    </div>
  
  `,
};

// Creation de l'applicaton et montage
Vue.createApp(RootComponent).mount("#root");
