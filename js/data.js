/* ============================================================
   BASE DE DONNÉES — Équipes européennes & générateur de joueurs
   ============================================================ */

var FM = window.FM || {};
window.FM = FM;

/* ---------- Pools de noms par nationalité ---------- */
const NAMES = {
  FRA: {
    first: ["Lucas","Hugo","Théo","Nathan","Enzo","Léo","Gabriel","Raphaël","Louis","Jules","Adam","Maël","Noah","Ethan","Sacha","Tom","Antoine","Kylian","Ousmane","Aurélien","Marcus","Randal","Ibrahima","Wesley","Bradley"],
    last: ["Martin","Bernard","Dubois","Thomas","Robert","Petit","Durand","Leroy","Moreau","Simon","Laurent","Lefebvre","Michel","Garcia","David","Bertrand","Roux","Fontaine","Girard","Bonnet","Dupont","Lambert","Fernandez","Rousseau","Blanc","Guerin","Muller","Henry","Roussel","Nicolas"]
  },
  ENG: {
    first: ["Harry","Jack","Oliver","George","Jacob","Charlie","Thomas","Oscar","William","James","Henry","Leo","Alfie","Joshua","Freddie","Archie","Ethan","Jude","Phil","Marcus","Bukayo","Declan","Reece","Trent","Mason"],
    last: ["Smith","Jones","Taylor","Brown","Williams","Wilson","Johnson","Davies","Robinson","Wright","Thompson","Evans","Walker","White","Roberts","Green","Hall","Wood","Jackson","Clarke","Kane","Bellingham","Foden","Saka","Rice","Rashford","Sterling","Grealish","Maddison","Stones"]
  },
  ESP: {
    first: ["Pablo","Alejandro","Daniel","David","Adrián","Álvaro","Javier","Sergio","Marcos","Diego","Mario","Carlos","Hugo","Iker","Pau","Gavi","Pedri","Ferran","Dani","Rodri","Marco","Álex","Nico","Ansu","Yeremy"],
    last: ["García","Fernández","González","Rodríguez","López","Martínez","Sánchez","Pérez","Gómez","Ruiz","Díaz","Torres","Ramos","Morales","Ortega","Castillo","Vázquez","Molina","Serrano","Iglesias","Olmo","Fati","Asensio","Isco","Merino"]
  },
  ITA: {
    first: ["Francesco","Alessandro","Lorenzo","Matteo","Andrea","Gabriele","Riccardo","Tommaso","Federico","Davide","Marco","Luca","Nicolò","Giacomo","Simone","Sandro","Gianluigi","Manuel","Bryan","Wilfried","Moise","Giovanni","Nicola","Alessio","Samuele"],
    last: ["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Marino","Greco","Bruno","Gallo","Conti","De Luca","Mancini","Costa","Giordano","Rizzo","Lombardi","Barbieri","Chiesa","Barella","Locatelli","Verratti","Scamacca"]
  },
  GER: {
    first: ["Leon","Luca","Felix","Maximilian","Paul","Elias","Jonas","Ben","Noah","Finn","Luis","Niklas","Julian","Kai","Serge","Jamal","Florian","Joshua","Timo","Leroy","Thomas","Marco","Nico","Robin","David"],
    last: ["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Koch","Bauer","Richter","Klein","Wolf","Neuer","Kimmich","Goretzka","Wirtz","Havertz","Sané","Gündogan","Rüdiger","Süle","Brandt"]
  },
  POR: {
    first: ["João","Diogo","Rúben","Bruno","Bernardo","Rafael","Gonçalo","André","Tomás","Miguel","Nuno","Vitinha","Otávio","Pedro","Ricardo","Nélson","José","Cristiano","Rúi","Fábio","Gabriel","Danilo","Matheus","Pepe","Trincão"],
    last: ["Silva","Santos","Ferreira","Pereira","Oliveira","Costa","Rodrigues","Martins","Jesus","Sousa","Fernandes","Gonçalves","Gomes","Lopes","Marques","Almeida","Ribeiro","Pinto","Carvalho","Neves","Leão","Cancelo","Dalot","Palhinha","Ramos"]
  },
  BRA: {
    first: ["Gabriel","Lucas","Bruno","Rodrygo","Vinícius","Éder","Antony","Raphinha","Casemiro","Marquinhos","Danilo","Fabinho","Richarlison","Alisson","Ederson","Neymar","Pedro","Endrick","Savinho","Wesley","Douglas","André","João","Matheus","Bento"],
    last: ["Silva","Souza","Santos","Oliveira","Pereira","Lima","Carlos","Costa","Rodrigues","Almeida","Nascimento","Barbosa","Ribeiro","Alves","Ferreira","Jesus","Júnior","Martins","Rocha","Gomes","Vieira","Cardoso","Moraes","Correia","Dias"]
  },
  ARG: {
    first: ["Lionel","Julián","Lautaro","Enzo","Alexis","Rodrigo","Nicolás","Emiliano","Ángel","Cristian","Leandro","Nahuel","Facundo","Gonzalo","Thiago","Alejandro","Exequiel","Giovani","Marcos","Germán","Franco","Valentín","Matías","Lucas","Nicolás"],
    last: ["González","Rodríguez","Martínez","Fernández","López","Díaz","Álvarez","Romero","Sánchez","Torres","Gómez","Paredes","Mac Allister","Molina","Otamendi","Acuña","Palacios","Lo Celso","Correa","Simeone","Dybala","Nico","Garnacho","Foyth","Tagliafico"]
  },
  NED: {
    first: ["Daan","Sem","Luuk","Bram","Lucas","Milan","Levi","Cody","Frenkie","Memphis","Denzel","Nathan","Virgil","Matthijs","Xavi","Ryan","Steven","Wout","Teun","Jurriën","Micky","Tijjani","Quinten","Joey","Noa"],
    last: ["de Jong","van Dijk","Bakker","de Vries","van den Berg","Jansen","Visser","Smit","Meijer","de Boer","Dumfries","Gakpo","Simons","Timber","Reijnders","Malen","Weghorst","Koopmeiners","Depay","Bergwijn","Frimpong","de Ligt","Wijnaldum","Klaassen","Berghuis"]
  },
  BEL: {
    first: ["Kevin","Romelu","Youri","Jérémy","Amadou","Charles","Leandro","Dodi","Arthur","Thomas","Yannick","Timothy","Loïs","Wout","Jan","Axel","Dries","Michy","Hans","Zeno","Maxim","Aster","Roméo","Orel","Johan"],
    last: ["De Bruyne","Lukaku","Tielemans","Doku","Onana","De Ketelaere","Trossard","Lukebakio","Theate","Meunier","Carrasco","Castagne","Openda","Faes","Vertonghen","Witsel","Mertens","Batshuayi","Vanaken","Debast","De Cuyper","Vermeeren","Lavia","Mangala","Bakayoko"]
  }
};

/* Viviers de noms par nationalité (pour la profondeur générée : clubs & sélections) */
Object.assign(NAMES, {
  GRE:{ first:["Giorgos","Dimitris","Kostas","Nikos","Vasilis","Panagiotis","Christos","Ioannis","Andreas","Petros","Stelios","Thanasis","Alexandros","Manolis","Tasos","Lefteris","Yannis","Sokratis"],
        last:["Papadopoulos","Giannakis","Nikolaidis","Karagiannis","Vlachos","Samaras","Fortounis","Mavropanos","Bakasetas","Masouras","Retsos","Siopis","Pavlidis","Tzavellas","Stafylidis","Kourbelis","Douvikas","Konstantelias"] },
  CRO:{ first:["Luka","Ivan","Marko","Mateo","Josip","Ante","Domagoj","Andrej","Mario","Nikola","Dejan","Borna","Filip","Petar","Ivica","Tin","Bruno","Lovro"],
        last:["Modric","Kovacic","Perisic","Brozovic","Kramaric","Lovren","Vlasic","Gvardiol","Sucic","Pasalic","Juranovic","Vida","Livakovic","Sosa","Majer","Budimir","Stanisic","Erlic"] },
  NOR:{ first:["Erling","Martin","Alexander","Sander","Kristian","Mats","Ola","Jonas","Fredrik","Morten","Stefan","Leo","Patrick","Julian","Andreas","Hakon","Emil","Birk"],
        last:["Haaland","Odegaard","Sorloth","Berge","Nusa","Ryerson","Ostigard","Aursnes","Thorsby","Bobb","Larsen","Elyounoussi","Berg","Hauge","Meling","Vetlesen","Bjorkan","Ajer"] },
  DEN:{ first:["Christian","Kasper","Andreas","Pierre-Emile","Joakim","Rasmus","Mikkel","Thomas","Jonas","Victor","Anders","Jesper","Frederik","Nicolai","Simon","Yussuf","Morten","Mathias"],
        last:["Eriksen","Hojbjerg","Schmeichel","Christensen","Maehle","Kjaer","Dolberg","Hjulmand","Olsen","Damsgaard","Andersen","Wind","Norgaard","Poulsen","Vestergaard","Larsen","Delaney","Lindstrom"] },
  SUI:{ first:["Granit","Xherdan","Manuel","Yann","Remo","Ricardo","Breel","Fabian","Silvan","Denis","Nico","Ruben","Michel","Renato","Zeki","Dan","Ulisses","Cedric"],
        last:["Xhaka","Shaqiri","Akanji","Sommer","Freuler","Rodriguez","Embolo","Schar","Widmer","Zakaria","Elvedi","Vargas","Aebischer","Steffen","Amdouni","Ndoye","Garcia","Jashari"] },
  AUT:{ first:["David","Marcel","Marko","Konrad","Xaver","Christoph","Nicolas","Patrick","Stefan","Florian","Michael","Alexander","Maximilian","Romano","Philipp","Andreas","Junior","Kevin"],
        last:["Alaba","Sabitzer","Arnautovic","Laimer","Schlager","Baumgartner","Seiwald","Wimmer","Lienhart","Danso","Posch","Grillitsch","Gregoritsch","Schmid","Mwene","Kalajdzic","Prass","Trauner"] },
  TUR:{ first:["Hakan","Arda","Kenan","Merih","Cengiz","Kaan","Yusuf","Ferdi","Orkun","Zeki","Salih","Baris","Kerem","Irfan","Okay","Mert","Ismail","Abdulkerim"],
        last:["Calhanoglu","Guler","Yildiz","Demiral","Under","Ayhan","Yazici","Kadioglu","Kokcu","Celik","Ozcan","Kabak","Akturkoglu","Kahveci","Yokuslu","Muldur","Bardakci","Yuksek"] },
  UKR:{ first:["Andriy","Oleksandr","Mykhailo","Ruslan","Illia","Georgiy","Vitaliy","Serhiy","Roman","Taras","Mykola","Bohdan","Volodymyr","Artem","Denys","Yevhen","Viktor","Heorhiy"],
        last:["Yarmolenko","Zinchenko","Mudryk","Malinovskyi","Sudakov","Dovbyk","Tsygankov","Trubin","Zabarnyi","Konoplya","Matviyenko","Stepanenko","Yaremchuk","Shaparenko","Sydorchuk","Brazhko","Bondar","Karavaev"] },
  SRB:{ first:["Dusan","Aleksandar","Sergej","Nemanja","Filip","Luka","Andrija","Strahinja","Nikola","Vanja","Marko","Ivan","Sasa","Predrag","Darko","Milos","Uros","Lazar"],
        last:["Vlahovic","Mitrovic","Milinkovic-Savic","Tadic","Kostic","Jovic","Gudelj","Pavlovic","Zivkovic","Milenkovic","Maksimovic","Lukic","Ilic","Babic","Rajkovic","Grujic","Veljkovic","Samardzic"] },
  POL:{ first:["Robert","Piotr","Wojciech","Jakub","Nicola","Sebastian","Kamil","Bartosz","Przemyslaw","Karol","Grzegorz","Damian","Krzysztof","Lukasz","Mateusz","Arkadiusz","Jan","Michal"],
        last:["Lewandowski","Zielinski","Szczesny","Kiwior","Zalewski","Frankowski","Glik","Grosicki","Swiderski","Bednarek","Krychowiak","Szymanski","Cash","Piatek","Skorupski","Bereszynski","Milik","Kaminski"] },
  SWE:{ first:["Alexander","Emil","Dejan","Viktor","Anthony","Isak","Ludwig","Mattias","Robin","Gustav","Jesper","Kristoffer","Sebastian","Albin","Jens","Daniel","Hugo","Yasin"],
        last:["Forsberg","Kulusevski","Lindelof","Elanga","Gyokeres","Claesson","Svensson","Ekdal","Olsson","Augustinsson","Nordfeldt","Bergstrom","Larsson","Karlstrom","Cajuste","Ayari","Bernhardsson","Nilsson"] },
  SCO:{ first:["Andrew","Scott","John","Callum","Ryan","Kieran","Billy","Che","Stuart","Grant","Lyndon","Nathan","Lewis","Anthony","Jack","Aaron","Greg","Liam"],
        last:["Robertson","McTominay","McGinn","Tierney","Christie","Gilmour","Adams","Hendry","Armstrong","Dykes","McGregor","McLean","Ferguson","Ralston","Hickey","Gunn","Cooper","Morgan"] },
  HUN:{ first:["Dominik","Willi","Roland","Adam","Attila","Andras","Milos","Peter","Balazs","Zsolt","Daniel","Barnabas","Martin","Bendeguz","Laszlo","Krisztofer","Endre","Marton"],
        last:["Szoboszlai","Orban","Sallai","Nagy","Fiola","Szalai","Kleinheisler","Gulacsi","Styles","Varga","Bolla","Kerkez","Csoboth","Dardai","Schafer","Nego","Botka","Gazdag"] },
  CZE:{ first:["Patrik","Tomas","Vladimir","Antonin","Ladislav","Adam","Lukas","David","Jakub","Vaclav","Ondrej","Petr","Michal","Jan","Mojmir","Robin","Matej","Vitezslav"],
        last:["Schick","Soucek","Coufal","Barak","Krejci","Hlozek","Provod","Chory","Jurasek","Hranac","Cerny","Vydra","Kral","Sadilek","Holes","Douderla","Vlcek","Zima"] },
  WAL:{ first:["Aaron","Harry","Daniel","Ben","Neco","Brennan","Kieffer","Joe","Connor","Ethan","David","Chris","Jordan","Rhys","Wes","Tom","Sorba","Nathan"],
        last:["Ramsey","Wilson","James","Davies","Williams","Johnson","Moore","Rodon","Roberts","Ampadu","Brooks","Mepham","Colwill","Burns","Cabango","Thomas","Levitt","Harris"] },
  ROU:{ first:["Nicolae","Ianis","Radu","Denis","Razvan","Andrei","Florinel","Valentin","Nicusor","Dennis","Marius","Vlad","Darius","Alexandru","Ciprian","George","Adrian","Octavian"],
        last:["Stanciu","Hagi","Dragusin","Man","Marin","Mihaila","Coman","Nita","Burca","Racovitan","Sorescu","Chiriches","Bancu","Olaru","Tanase","Puscas","Cicaldau","Popescu"] },
  URU:{ first:["Federico","Darwin","Ronald","Rodrigo","Manuel","Nicolas","Facundo","Nahitan","Giorgian","Sebastian","Matias","Jose","Luis","Maximiliano","Diego","Agustin","Santiago","Brian"],
        last:["Valverde","Nunez","Araujo","Bentancur","Ugarte","De Arrascaeta","De la Cruz","Pellistri","Vecino","Gimenez","Olivera","Cavani","Suarez","Vina","Torreira","Rodriguez","Canobbio","Rossi"] },
  COL:{ first:["Luis","James","Juan","Rafael","Davinson","Jefferson","Wilmar","Mateus","Jhon","Daniel","Jorge","Yerry","Johan","Camilo","Nelson","Santiago","Kevin","Richard"],
        last:["Diaz","Rodriguez","Cuadrado","Borre","Sanchez","Lerma","Barrios","Uribe","Cordoba","Munoz","Mojica","Mina","Arias","Vargas","Deossa","Sinisterra","Castano","Zapata"] },
  ECU:{ first:["Enner","Moises","Piero","Pervis","Angelo","Gonzalo","Felix","Kendry","Carlos","Jeremy","Alan","Willian","Jordy","Djorkaeff","Xavier","Alexander","Jackson","John"],
        last:["Valencia","Caicedo","Hincapie","Estupinan","Preciado","Plata","Torres","Paez","Gruezo","Sarmiento","Franco","Pacho","Alcivar","Reasco","Arboleda","Dominguez","Porozo","Mena"] },
  CHI:{ first:["Alexis","Arturo","Ben","Charles","Gabriel","Guillermo","Erick","Paulo","Marcelino","Dario","Diego","Victor","Claudio","Eduardo","Igor","Cesar","Felipe","Mauricio"],
        last:["Sanchez","Vidal","Brereton","Aranguiz","Suazo","Maripan","Pulgar","Diaz","Nunez","Osorio","Valdes","Davila","Bravo","Vargas","Lichnovsky","Pinares","Aravena","Isla"] },
  PER:{ first:["Paolo","Gianluca","Renato","Andre","Christian","Edison","Luis","Miguel","Yoshimar","Alex","Sergio","Marcos","Wilder","Aldo","Bryan","Oliver","Piero","Pedro"],
        last:["Guerrero","Lapadula","Tapia","Carrillo","Cueva","Flores","Advincula","Trauco","Yotun","Valera","Pena","Lopez","Cartagena","Corzo","Reyna","Sonne","Quispe","Aquino"] },
  PAR:{ first:["Miguel","Angel","Julio","Gustavo","Antonio","Mathias","Omar","Alejandro","Diego","Ramon","Braian","Damian","Robert","Fabian","Junior","Adam","Richard","Bruno"],
        last:["Almiron","Romero","Enciso","Gomez","Sanabria","Villasanti","Alderete","Balbuena","Cubas","Bareiro","Ortiz","Martinez","Espinola","Valdez","Gonzalez","Barrios","Ramirez","Ojeda"] },
  MAR:{ first:["Achraf","Hakim","Youssef","Sofyan","Noussair","Azzedine","Romain","Selim","Amine","Bilal","Abde","Yassine","Nayef","Ilias","Sofiane","Zakaria","Anass","Walid"],
        last:["Hakimi","Ziyech","En-Nesyri","Amrabat","Mazraoui","Ounahi","Saiss","Amallah","Harit","El Khannouss","Ezzalzouli","Bounou","Aguerd","Chair","Boufal","Aboukhlal","Cheddira","Attiat-Allah"] },
  SEN:{ first:["Sadio","Kalidou","Ismaila","Nicolas","Idrissa","Boulaye","Krepin","Pape","Nampalys","Abdou","Cheikhou","Youssouf","Iliman","Habib","Formose","Lamine","Moussa","Fode"],
        last:["Mane","Koulibaly","Sarr","Jackson","Gueye","Dia","Diatta","Mendy","Diallo","Kouyate","Sabaly","Ndiaye","Diedhiou","Camara","Ciss","Ballo-Toure","Jakobs","Diouf"] },
  NGA:{ first:["Victor","Alex","Samuel","Kelechi","Wilfred","Ademola","Joe","Calvin","Frank","Moses","Terem","Kenneth","Ola","Semi","Bright","Raphael","Paul","Zaidu"],
        last:["Osimhen","Iwobi","Chukwueze","Iheanacho","Ndidi","Lookman","Aribo","Bassey","Onyeka","Simon","Moffi","Omeruo","Aina","Ajayi","Osayi-Samuel","Onyedika","Onuachu","Sanusi"] },
  EGY:{ first:["Mohamed","Omar","Mostafa","Ahmed","Mahmoud","Ramadan","Akram","Nabil","Tarek","Amr","Karim","Hamdi","Marwan","Ibrahim","Mohanad","Emam","Sam","Trezeguet"],
        last:["Salah","Marmoush","Elneny","Hegazi","Trezeguet","Sobhi","Ashour","Fathi","Emam","Hamdi","Zizo","Warda","Morsy","Ashraf","Attia","Adel","Abdelmonem","Kabaka"] },
  ALG:{ first:["Riyad","Ismael","Said","Ramy","Youcef","Aissa","Islam","Nabil","Sofiane","Adam","Houssem","Amine","Ramiz","Fares","Rachid","Baghdad","Mohamed","Ilan"],
        last:["Mahrez","Bennacer","Benrahma","Slimani","Atal","Mandi","Bentaleb","Bounedjah","Feghouli","Ounas","Aouar","Gouiri","Zerrouki","Chaibi","Belaili","Bouanani","Zorgane","Guedioura"] },
  CIV:{ first:["Franck","Sebastien","Nicolas","Wilfried","Serge","Ibrahim","Seko","Jean-Philippe","Max","Odilon","Simon","Ghislain","Christian","Hamed","Willy","Jonathan","Amad","Oumar"],
        last:["Kessie","Haller","Pepe","Zaha","Aurier","Sangare","Fofana","Gradel","Kouame","Diomande","Adingra","Konan","Boly","Bailly","Doumbia","Cornet","Diallo","Traore"] },
  CMR:{ first:["Andre","Vincent","Karl","Bryan","Jean-Charles","Frank","Georges","Martin","Olivier","Christian","Collins","Nouhou","Enzo","Carlos","Jerome","Ambroise","Pierre","Michael"],
        last:["Onana","Aboubakar","Toko Ekambi","Mbeumo","Castelletto","Anguissa","Ngadeu","Hongla","Ntcham","Bassogog","Fai","Tolo","Ebosse","Baleba","Wooh","Oyongo","Kunde","Magri"] },
  GHA:{ first:["Thomas","Mohammed","Jordan","Andre","Daniel","Inaki","Antoine","Kamaldeen","Alexander","Osman","Tariq","Abdul","Elisha","Ernest","Gideon","Salis","Ransford","Denis"],
        last:["Partey","Kudus","Ayew","Amartey","Sulemana","Williams","Semenyo","Lamptey","Djiku","Bukari","Owusu","Nuamah","Odoi","Baba","Mensah","Salisu","Yeboah","Fatawu"] },
  TUN:{ first:["Wahbi","Youssef","Aissa","Ellyes","Montassar","Hannibal","Anis","Mohamed","Ali","Ferjani","Naim","Seifeddine","Dylan","Elias","Yassine","Firas","Hamza","Nader"],
        last:["Khazri","Msakni","Laidouni","Skhiri","Talbi","Mejbri","Slimane","Drager","Maaloul","Sassi","Bronn","Jaziri","Meriah","Achouri","Chaouat","Ben Romdhane","Ghandri","Abdi"] },
  JPN:{ first:["Takefusa","Wataru","Kaoru","Ritsu","Daichi","Junya","Ao","Takumi","Hidemasa","Ko","Takehiro","Yuki","Ayase","Hiroki","Reo","Shogo","Daizen","Keito"],
        last:["Kubo","Endo","Mitoma","Doan","Kamada","Ito","Tanaka","Minamino","Morita","Itakura","Tomiyasu","Soma","Ueda","Sakai","Hatate","Taniguchi","Maeda","Nakamura"] },
  KOR:{ first:["Heung-min","Kang-in","Min-jae","Woo-young","Hee-chan","Ui-jo","In-beom","Chang-hoon","Young-gwon","Jin-su","Seung-ho","Gue-sung","Moon-hwan","Jae-sung","Tae-hwan","Sang-ho","Kyung-won","Ji-soo"],
        last:["Son","Lee","Kim","Jung","Hwang","Cho","Kwon","Paik","Na","Hong","Park","Oh","Seol","Yang","Baek","Jeong","Um","Koo"] },
  IRN:{ first:["Mehdi","Sardar","Alireza","Karim","Saman","Ramin","Ahmad","Milad","Saeid","Omid","Morteza","Vahid","Shoja","Majid","Ali","Hossein","Mohammad","Rouzbeh"],
        last:["Taremi","Azmoun","Jahanbakhsh","Ansarifard","Ghoddos","Rezaeian","Nourollahi","Mohammadi","Ezatolahi","Noorafkan","Pouraliganji","Amiri","Khalilzadeh","Hosseini","Gholizadeh","Cheshmi","Torabi","Karimi"] },
  AUS:{ first:["Mathew","Harry","Jackson","Aaron","Craig","Riley","Jason","Ajdin","Connor","Martin","Cameron","Keanu","Nathaniel","Jordy","Jamie","Kusini","Sammy","Alessandro"],
        last:["Ryan","Souttar","Irvine","Mooy","Goodwin","McGree","Hrustic","Boyle","Metcalfe","Baccus","Devlin","Yengi","Atkinson","Duke","Maclaren","Karacic","Behich","Wright"] },
  KSA:{ first:["Salem","Firas","Salman","Mohammed","Abdullah","Ali","Saud","Nasser","Sami","Hassan","Feras","Abdulelah","Musab","Faisal","Riyadh","Yasser","Sultan","Abdulrahman"],
        last:["Al-Dawsari","Al-Buraikan","Al-Faraj","Kanno","Al-Malki","Al-Bulaihi","Abdulhamid","Al-Owais","Al-Najei","Tambakti","Al-Ghannam","Al-Amri","Al-Shehri","Al-Nemer","Sharahili","Al-Breik","Al-Yami","Al-Hassan"] },
  MEX:{ first:["Hirving","Edson","Raul","Santiago","Cesar","Guillermo","Luis","Jorge","Orbelin","Uriel","Jesus","Carlos","Alexis","Israel","Julian","Erick","Roberto","Henry"],
        last:["Lozano","Alvarez","Jimenez","Gimenez","Montes","Ochoa","Chavez","Sanchez","Pineda","Antuna","Gallardo","Rodriguez","Vega","Reyes","Quinones","Alvarado","Sepulveda","Martin"] },
  USA:{ first:["Christian","Weston","Tyler","Yunus","Gio","Tim","Sergino","Antonee","Brenden","Folarin","Ricardo","Matt","Chris","Cameron","Malik","Josh","Auston","Johnny"],
        last:["Pulisic","McKennie","Adams","Musah","Reyna","Weah","Dest","Robinson","Aaronson","Balogun","Pepi","Turner","Richards","Carter-Vickers","Tillman","Sargent","Moore","Cardoso"] },
  CAN:{ first:["Alphonso","Jonathan","Cyle","Stephen","Tajon","Ismael","Jacob","Richie","Alistair","Kamal","Liam","Derek","Sam","Mark-Anthony","Junior","Dayne","Moise","Jonathan"],
        last:["Davies","David","Larin","Eustaquio","Buchanan","Kone","Shaffelburg","Laryea","Johnston","Miller","Fraser","Cornelius","Adekugbe","Kaye","Hoilett","Bombito","Osorio","Ahmed"] },
  RUS:{ first:["Aleksandr","Aleksei","Fyodor","Matvei","Anton","Dmitri","Andrei","Maksim","Ivan","Georgi","Zakhar","Arsen","Danil","Nikolai","Vyacheslav","Sergei","Konstantin","Rifat"],
        last:["Golovin","Miranchuk","Smolov","Safonov","Zabolotny","Barinov","Chistyakov","Sergeev","Dzhikiya","Zakharyan","Glushenkov","Kuzyaev","Diveev","Obliakov","Fomin","Zhemaletdinov","Karpukhin","Sobolev"] }
});

/* Viviers additionnels — le reste des nationalités (UEFA, CAF, AFC, CONMEBOL, CONCACAF, OFC) */
Object.assign(NAMES, {
  SVK:{ first:["Marek","Milan","Stanislav","David","Lukas","Peter","Juraj","Ondrej","Tomas","Robert","Denis","Norbert","Ivan","Matus"],
        last:["Hamsik","Skriniar","Hancko","Kucka","Duda","Lobotka","Haraslin","Bozenik","Schranz","Pekarik","Valjent","Suslov","Bero","Duris"] },
  SVN:{ first:["Jan","Benjamin","Josip","Andraz","Adam","Timi","Petar","Erik","Sandi","Miha","Vanja","Jaka","Jon","Zan"],
        last:["Oblak","Sesko","Ilicic","Sporar","Cerin","Elsnik","Stojanovic","Janza","Lovric","Blazic","Verbic","Karnicnik","Vipotnik","Bijol"] },
  IRL:{ first:["Seamus","Shane","John","Chiedozie","Josh","Nathan","Matt","Jason","Evan","Callum","Alan","Adam","Will","Jayson"],
        last:["Coleman","Duffy","Egan","Ogbene","Cullen","Collins","Doherty","Knight","Ferguson","Robinson","Browne","Idah","Smallbone","Molumby"] },
  NIR:{ first:["Jonny","Steven","Craig","Paddy","Conor","Shea","George","Isaac","Dion","Jamal","Josh","Trai","Daniel","Ali"],
        last:["Evans","Davis","Cathcart","McNair","Bradley","Charles","Saville","Price","Ballard","Lewis","Magennis","Hume","Reid","McCann"] },
  ISL:{ first:["Gylfi","Alfred","Johann","Birkir","Arnor","Sverrir","Hordur","Willum","Andri","Kolbeinn","Hakon","Isak","Mikael","Aron"],
        last:["Sigurdsson","Finnbogason","Gudmundsson","Bjarnason","Traustason","Ingason","Magnusson","Willumsson","Gudjohnsen","Sigthorsson","Haraldsson","Ellertsson","Palsson","Gunnarsson"] },
  FIN:{ first:["Teemu","Glen","Robin","Joel","Fredrik","Robert","Rasmus","Nikolai","Onni","Daniel","Leo","Jere","Oliver","Kaan"],
        last:["Pukki","Kamara","Lod","Pohjanpalo","Jensen","Taylor","Schuller","Alho","Valakari","O'Shaughnessy","Uronen","Peltola","Antman","Walta"] },
  BIH:{ first:["Edin","Miralem","Sead","Haris","Amir","Ermedin","Rade","Ibrahim","Nikola","Amar","Dennis","Benjamin","Gojko","Adnan"],
        last:["Dzeko","Pjanic","Kolasinac","Hajradinovic","Begic","Demirovic","Krunic","Sunjic","Cimirot","Dedic","Tahirovic","Katic","Hadziahmetovic","Barisic"] },
  ALB:{ first:["Armando","Berat","Kristjan","Nedim","Elseid","Adrion","Ylber","Jasir","Thomas","Mario","Klaus","Qazim","Arber","Ernest"],
        last:["Broja","Djimsiti","Asllani","Bajrami","Hysaj","Ramadani","Asani","Mihaj","Strakosha","Gjasula","Hoxha","Laci","Manaj","Muci"] },
  MKD:{ first:["Goran","Eljif","Enis","Ezgjan","Stefan","Darko","Bojan","Vlatko","Aleksandar","Milan","Jani","David","Ilija","Boban"],
        last:["Pandev","Elmas","Bardhi","Alioski","Ristovski","Churlinov","Miovski","Stojanovski","Trajkovski","Ristevski","Atanasov","Nikolov","Spirovski","Ashkovski"] },
  BUL:{ first:["Kiril","Ilia","Georgi","Kristiyan","Andrian","Todor","Aleksandar","Iliyan","Marin","Petko","Filip","Martin","Valentin","Bozhidar"],
        last:["Despodov","Gruev","Rusev","Nedelev","Krastev","Chochev","Antov","Popov","Petkov","Kraev","Turitsov","Iliev","Vitanov","Delev"] },
  GEO:{ first:["Khvicha","Giorgi","Guram","Otar","Jaba","Budu","Georges","Luka","Lasha","Saba","Zuriko","Nika","Anzor","Sandro"],
        last:["Kvaratskhelia","Mamardashvili","Kashia","Kiteishvili","Kankava","Zivzivadze","Mikautadze","Lochoshvili","Dvali","Chakvetadze","Davitashvili","Gvelesiani","Kvirkvelia","Azarovi"] },
  ISR:{ first:["Manor","Eran","Oscar","Mohammad","Bibras","Dor","Eli","Munas","Tai","Idan","Sun","Neta","Gavriel","Omri"],
        last:["Solomon","Zahavi","Gloukh","Abu Fani","Natcho","Peretz","Dasa","Dabbur","Baribo","Toklomati","Menachem","Lavi","Kanichowsky","Gropper"] },
  MNE:{ first:["Stefan","Stevan","Nikola","Marko","Milutin","Adam","Deni","Sead","Risto","Igor","Andrija","Vasilije","Balsa","Marko"],
        last:["Mugosa","Jovetic","Vukcevic","Vesovic","Osmajic","Marusic","Radunovic","Haksabanovic","Radulovic","Ivanovic","Tomasevic","Krstovic","Adzic","Sekulic"] },
  KOS:{ first:["Milot","Vedat","Bernard","Amir","Elvis","Florent","Edon","Zymer","Ibrahim","Lirim","Betim","Fidan","Benjamin","Arber"],
        last:["Rashica","Muriqi","Berisha","Rrahmani","Rexhbecaj","Hadergjonaj","Zhegrova","Bytyqi","Dresevic","Kastrati","Kryeziu","Aliti","Muslija","Halimi"] },
  BLR:{ first:["Max","Vitali","Yuri","Igor","Nikolai","Pavel","Aleksandr","Denis","Valeri","Roman","Kirill","Gleb","Dmitri","Evgeni"],
        last:["Ebong","Lisakovich","Kovalev","Stasevich","Zabelin","Sedko","Bakhar","Yablonski","Volkov","Selyava","Klimovich","Nekhaychik","Podstrelov","Malashevich"] },
  KAZ:{ first:["Baktiyar","Abzal","Islambek","Georgi","Ruslan","Askhat","Nuraly","Yan","Serikzhan","Maksim","Dastan","Ramazan","Bekzat","Gafurzhan"],
        last:["Zaynutdinov","Beysebekov","Kuat","Zhukov","Valiullin","Tagybergen","Alip","Vorogovskiy","Muzhikov","Samorodov","Satpayev","Orazov","Aymbetov","Shvyrev"] },
  VEN:{ first:["Salomon","Yeferson","Jefferson","Tomas","Yangel","Darwin","Josef","Jhon","Nahuel","Eduard","Cristian","Jose","Alexander","Yordan"],
        last:["Rondon","Soteldo","Savarino","Rincon","Herrera","Machis","Martinez","Chancellor","Ferraresi","Bello","Casseres","Gonzalez","Osorio","Ramirez"] },
  BOL:{ first:["Marcelo","Roberto","Carmelo","Ramiro","Henry","Diego","Bruno","Jaume","Moises","Luis","Miguel","Jeyson","Efrain","Boris"],
        last:["Martins","Fernandez","Algaranaz","Vaca","Vargas","Bejarano","Miranda","Cuellar","Villarroel","Haquin","Chura","Justiniano","Villamil","Cespedes"] },
  RSA:{ first:["Percy","Themba","Ronwen","Teboho","Lyle","Sphephelo","Bongokuhle","Mothobi","Siyanda","Zakhele","Thapelo","Khuliso","Aubrey","Grant"],
        last:["Tau","Zwane","Williams","Mokoena","Foster","Sithole","Mbule","Mvala","Xulu","Lakay","Maswanganyi","Mudau","Modiba","Kekana"] },
  MLI:{ first:["Yves","Amadou","Hamari","Moussa","Sekou","Diadie","Kalifa","El Bilal","Nene","Falaye","Boubacar","Cheick","Lassine","Aliou"],
        last:["Bissouma","Haidara","Traore","Doumbia","Kone","Samassekou","Coulibaly","Sissoko","Dorgeles","Sacko","Fofana","Kouyate","Dieng","Sinayoko"] },
  BFA:{ first:["Bertrand","Edmond","Issa","Dango","Blati","Cyrille","Adama","Hassane","Gustavo","Zakaria","Mohamed","Steeve","Dramane","Ismahila"],
        last:["Traore","Tapsoba","Kabore","Ouattara","Toure","Bayala","Guira","Sangare","Sabo","Nikiema","Sanou","Yago","Ouedraogo","Nagalo"] },
  COD:{ first:["Cedric","Chancel","Yoane","Silas","Theo","Gael","Arthur","Meschack","Fiston","Samuel","Aaron","Simon","Grady","Charles"],
        last:["Bakambu","Mbemba","Wissa","Katompa","Bongonda","Kakuta","Masuaku","Elia","Mayele","Moutoussamy","Tuanzebe","Banza","Pickel","Kalulu"] },
  GUI:{ first:["Serhou","Naby","Ilaix","Amadou","Mohamed","Ibrahima","Aguibou","Morgan","Seydouba","Issiaga","Mory","Sory","Facinet","Antoine"],
        last:["Guirassy","Keita","Moriba","Diawara","Bayo","Camara","Guilavogui","Soumah","Sylla","Konate","Kante","Traore","Conte","Sidibe"] },
  CPV:{ first:["Ryan","Jovane","Garry","Bebe","Kevin","Deroy","Roberto","Dylan","Bruno","Nuno","Willy","Diney","Stopira","Yannick"],
        last:["Mendes","Cabral","Rodrigues","Semedo","Lopes","Tavares","Duarte","Varela","Andrade","Borges","Furtado","Lima","Barbosa","Delgado"] },
  GAB:{ first:["Pierre-Emerick","Denis","Mario","Bruno","Andre","Aaron","Guelor","Jim","Louis","Johann","Yannis","Ulrich","Sidney","Aziz"],
        last:["Aubameyang","Bouanga","Lemina","Ecuele Manga","Obiang","Boupendza","Kanga","Allevinah","Poko","Ndong","Meye","Mounie","Obame","Bibang"] },
  ZAM:{ first:["Patson","Fashion","Enock","Lameck","Kings","Frankie","Emmanuel","Klings","Edward","Kennedy","Golden","Clatous","Roderick","Stoppila"],
        last:["Daka","Sakala","Mwepu","Banda","Kangwa","Musonda","Sabuni","Mubita","Chilufya","Mumba","Chama","Kambole","Sunzu","Lubambo"] },
  ANG:{ first:["Gelson","Fredy","Zito","Mateus","Show","Jonathan","Chico","Gilberto","Ary","Bastos","Nurio","Milson","Bruno","Manuel"],
        last:["Dala","Ribeiro","Luvumbo","Buatu","Fernando","Fortunato","Banza","Gaspar","Papel","Quipapa","Kialonda","Pedro","Mabululu","Cabungula"] },
  QAT:{ first:["Akram","Almoez","Hassan","Boualem","Abdelkarim","Karim","Mohammed","Homam","Tarek","Assim","Ahmed","Mostafa","Musaab","Jassem"],
        last:["Afif","Ali","Al-Haydos","Khoukhi","Hassan","Boudiaf","Muntari","Ahmed","Salman","Madibo","Alaaeldin","Meshaal","Khedr","Gaber"] },
  IRQ:{ first:["Aymen","Ali","Sherko","Ibrahim","Bashar","Amjad","Mohanad","Alaa","Osama","Zidane","Hussein","Merchas","Rebin","Manaf"],
        last:["Hussein","Adnan","Karim","Bayesh","Resan","Attwan","Ali","Abbas","Rashid","Iqbal","Doski","Sulaka","Younis","Jabbar"] },
  UAE:{ first:["Ali","Fabio","Caio","Harib","Khalil","Yahya","Bandar","Majed","Sultan","Khalfan","Tahnoon","Abdullah","Luanzinho","Kouame"],
        last:["Mabkhout","Lima","Canedo","Abdalla","Ibrahim","Al-Ghassani","Al-Attas","Hassan","Adil","Mubarak","Al-Zaabi","Ramadan","Correia","Autonne"] },
  UZB:{ first:["Eldor","Abbosbek","Jaloliddin","Otabek","Rustam","Igor","Odiljon","Jasurbek","Khojimat","Oston","Sardor","Azizbek","Bobur","Farrukh"],
        last:["Shomurodov","Faizullaev","Masharipov","Shukurov","Ashurmatov","Sergeev","Hamrobekov","Yakhshiboev","Erkinov","Urunov","Rashidov","Turgunboev","Abdixolikov","Sayfiev"] },
  JOR:{ first:["Musa","Yazan","Mahmoud","Ehsan","Nizar","Ali","Mousa","Abdallah","Noor","Ahmad","Rajaei","Salem","Feras","Mohammad"],
        last:["Al-Taamari","Al-Naimat","Al-Mardi","Haddad","Al-Rashdan","Olwan","Tamari","Nasib","Al-Rawabdeh","Ersan","Al-Arab","Ayed","Al-Ajalin","Shelbaieh"] },
  CHN:{ first:["Wu","Zhang","Wei","Wang","Alan","Elkeson","Li","Tan","Gao","Xie","Dai","Xu","Yan","Zhu"],
        last:["Lei","Yuning","Shihao","Shangyuan","Zhen","Ke","Long","Zhunyi","Xi","Pengfei","Weiqian","Weijun","Xinghan","Chenjie"] },
  OMA:{ first:["Muhsen","Abdulaziz","Salaah","Ali","Arshad","Zahir","Khalid","Harib","Amjad","Mohammed","Jameel","Issam","Ahmed","Kashif"],
        last:["Al-Ghassani","Al-Muqbali","Al-Yahyaei","Al-Busaidi","Al-Alawi","Al-Mushaifri","Al-Kaabi","Al-Saadi","Al-Habsi","Al-Rushaidi","Al-Khamisi","Al-Sabhi","Al-Harthi","Al-Ajmi"] },
  VIE:{ first:["Nguyen","Quang","Cong","Van","Hoang","Doan","Bui","Tuan","Phan","Do","Pham","Que","Nham","Tran"],
        last:["Hai","Phuong","Toan","Duc","Hau","Van Hau","Tien Linh","Anh","Filip","Van Duc","Hung Dung","Xuan Truong","Ngoc Hai","Thanh"] },
  THA:{ first:["Chanathip","Teerasil","Supachok","Theerathon","Ekanit","Sarach","Bordin","Suphanat","Kritsada","Weerathep","Sasalak","Peeradon","Worachit","Adisak"],
        last:["Songkrasin","Dangda","Sarachat","Bunmathan","Emvutthikul","Yooyen","Sroywong","Mukda","Kaewsakul","Winothai","Haiprakhon","Chippunya","Narkiam","Kruyat"] },
  CRC:{ first:["Keylor","Joel","Celso","Francisco","Kendall","Bryan","Anthony","Alvaro","Manfred","Jewison","Carlos","Orlando","Alonso","Juan"],
        last:["Navas","Campbell","Borges","Calvo","Waston","Ruiz","Contreras","Zamora","Ugalde","Bennette","Martinez","Galo","Vargas","Aguilera"] },
  PAN:{ first:["Michael","Anibal","Ismael","Cesar","Fidel","Adalberto","Eric","Cecilio","Ivan","Andres","Jose","Edgardo","Harold","Omar"],
        last:["Murillo","Godoy","Diaz","Blackman","Escobar","Carrasquilla","Davis","Waterman","Anderson","Andrade","Fajardo","Barcenas","Cummings","Browne"] },
  JAM:{ first:["Leon","Michail","Demarai","Bobby","Ethan","Kasey","Damion","Amari","Shamar","Dexter","Andre","Kevon","Greg","Renaldo"],
        last:["Bailey","Antonio","Gray","Reid","Pinnock","Palmer","Lowe","Nicholson","Lembikisa","Blake","Lamptey","Bernard","Leigh","Latibeaudiere"] },
  HON:{ first:["Alberth","Anthony","Romell","Luis","Denil","Jorge","Kervin","Edwin","Rigoberto","Deybi","Alexander","Joseph","Choco","Bryan"],
        last:["Elis","Lozano","Quioto","Palma","Arriaga","Alvarez","Rodriguez","Lopez","Flores","Acosta","Rosales","Moncada","Nunez","Benguche"] },
  SLV:{ first:["Alex","Enrico","Darwin","Christian","Nathan","Bryan","Eriq","Amando","Jairo","Ronald","Marcelo","Harold","Joaquin","Walmer"],
        last:["Roldan","Duenas","Ceren","Gil","Ordonez","Tamacas","Zelaya","Moreno","Henriquez","Rodriguez","Diaz","Alas","Rivas","Cerritos"] },
  TRI:{ first:["Kevin","Levi","Alvin","Nathaniel","Reon","Justin","Joevin","Aubrey","Daniel","Marvin","Andre","Ryan","Noah","Malcolm"],
        last:["Molino","Garcia","Jones","Powder","Cornwall","David","Phillips","Phillip","Rampersad","Telfer","Fortune","Boissiere","John","Bailey"] },
  NZL:{ first:["Chris","Winston","Marco","Liberato","Matthew","Elijah","Ben","Sarpreet","Alex","Callum","Joe","Michael","Tim","Bill"],
        last:["Wood","Reid","Rojas","Cacace","Garbett","Just","Waine","Singh","Rufer","McCowatt","Bell","Boxall","Payne","Tuiloma"] }
});

/* ---------- Postes ---------- */
const POSITIONS = ["GB","DC","DG","DD","MDC","MC","MO","AG","AD","BU"];
const POS_GROUP = { GB:"G", DC:"D", DG:"D", DD:"D", MDC:"M", MC:"M", MO:"M", AG:"A", AD:"A", BU:"A" };
const POS_LABEL = {
  GB:"Gardien", DC:"Déf. central", DG:"Latéral gauche", DD:"Latéral droit",
  MDC:"Milieu déf.", MC:"Milieu central", MO:"Milieu off.", AG:"Ailier gauche",
  AD:"Ailier droit", BU:"Buteur"
};

/* ---------- Formations : postes requis ---------- */
/* Chaque ligne est ordonnée de GAUCHE à DROITE (comme à l'écran), gardien d'abord */
const FORMATIONS = {
  "4-4-2":  ["GB","DG","DC","DC","DD","AG","MC","MC","AD","BU","BU"],
  "4-3-3":  ["GB","DG","DC","DC","DD","MC","MDC","MC","AG","BU","AD"],
  "4-2-3-1":["GB","DG","DC","DC","DD","MDC","MDC","AG","MO","AD","BU"],
  "3-5-2":  ["GB","DC","DC","DC","AG","MC","MDC","MC","AD","BU","BU"],
  "5-3-2":  ["GB","DG","DC","DC","DC","DD","MC","MDC","MC","BU","BU"],
  "4-5-1":  ["GB","DG","DC","DC","DD","AG","MC","MDC","MC","AD","BU"]
};

/* ---------- Clubs européens (réels) avec réputation & budget ----------
   rep: 1 (modeste) → 5 (élite continentale) ; budget en M€           */
const LEAGUES = [
  { id:"L1", nom:"Ligue 1", pays:"FRA", clubs:[
    ["Paris SG",5,220],    ["Marseille",4,90],    ["Monaco",4,85],
    ["Lille",3,55],    ["Lyon",3,60],    ["Nice",3,50],
    ["Rennes",3,48],    ["Lens",3,45],    ["Strasbourg",2,28],
    ["Toulouse",2,26],    ["Brest",2,22],    ["Le Havre",1,15],
    ["Auxerre",1,14],    ["Angers",2,30],    ["Lorient",2,30],
    ["Paris FC",2,30],    ["Troyes",2,30],    ["Le Mans",1,16]
  ]},
  { id:"PL", nom:"Premier League", pays:"ENG", clubs:[
    ["Manchester City",5,250],    ["Arsenal",5,180],    ["Liverpool",5,190],
    ["Chelsea",4,160],    ["Manchester Utd",4,150],    ["Tottenham",4,120],
    ["Newcastle",4,110],    ["Aston Villa",3,80],    ["Brighton",3,70],
    ["Everton",2,40],    ["Crystal Palace",2,42],    ["Fulham",2,44],
    ["Brentford",2,38],    ["Nottingham",2,36],    ["Bournemouth",2,30],
    ["Leeds",2,30],    ["Sunderland",2,30],    ["Coventry",1,16],
    ["Ipswich",1,16],    ["Hull",1,16]
  ]},
  { id:"LL", nom:"La Liga", pays:"ESP", clubs:[
    ["Real Madrid",5,240],    ["Barcelone",5,180],    ["Atlético",4,130],
    ["Athletic Bilbao",3,55],    ["Real Sociedad",3,60],    ["Villarreal",3,58],
    ["Betis",3,50],    ["Valence",3,48],    ["Séville",3,52],
    ["Getafe",2,26],    ["Osasuna",2,24],    ["Celta Vigo",2,28],
    ["Rayo Vallecano",1,18],    ["Espanyol",2,30],    ["Alavés",2,30],
    ["Levante",2,30],    ["Elche",2,30],    ["Racing Santander",1,16],
    ["Deportivo La Corogne",1,16],    ["Malaga",1,16]
  ]},
  { id:"SA", nom:"Serie A", pays:"ITA", clubs:[
    ["Inter",5,170],    ["Juventus",4,150],    ["Milan",4,140],
    ["Napoli",4,130],    ["Roma",4,100],    ["Atalanta",4,95],
    ["Lazio",3,80],    ["Fiorentina",3,65],    ["Bologna",3,55],
    ["Torino",2,40],    ["Udinese",2,32],    ["Monza",2,28],
    ["Genoa",2,26],    ["Lecce",1,18],    ["Cagliari",1,17],
    ["Como",3,60],    ["Parma",2,30],    ["Sassuolo",2,30],
    ["Venezia",1,16],    ["Frosinone",1,16]
  ]},
  { id:"BL", nom:"Bundesliga", pays:"GER", clubs:[
    ["Bayern Munich",5,230],    ["Leverkusen",5,150],    ["Dortmund",4,140],
    ["RB Leipzig",4,130],    ["Stuttgart",3,70],    ["Francfort",3,68],
    ["Fribourg",3,50],    ["Hoffenheim",2,45],    ["Mönchengladbach",2,44],
    ["Werder Brême",2,38],    ["Mayence",2,30],    ["Augsbourg",2,28],
    ["Union Berlin",2,32],    ["Hambourg",3,60],    ["Cologne",3,60],
    ["Schalke 04",3,60],    ["Elversberg",1,16],    ["Paderborn",1,16]
  ]},
  { id:"POR", nom:"Primeira Liga", pays:"POR", clubs:[
    ["Benfica",4,100],    ["Porto",4,100],    ["Sporting CP",4,100],
    ["Braga",4,100],    ["Vitoria de Guimaraes",3,45],    ["Famalicao",2,22],
    ["Santa Clara",2,22],    ["Gil Vicente",2,22],    ["Estoril",2,22],
    ["Casa Pia",2,22],    ["Arouca",2,22],    ["Estrela da Amadora",2,22],
    ["Nacional",2,22],    ["Rio Ave",2,22],    ["Alverca",2,22],
    ["Maritimo",1,12],    ["Academico de Viseu",1,12]
  ]},
  { id:"NER", nom:"Eredivisie", pays:"NED", clubs:[
    ["Ajax",4,100],    ["PSV",4,100],    ["Feyenoord",4,100],
    ["AZ",3,45],    ["FC Twente",3,45],    ["FC Utrecht",3,45],
    ["Go Ahead Eagles",2,22],    ["Sparta Rotterdam",2,22],    ["FC Groningen",2,22],
    ["NEC",2,22],    ["Fortuna Sittard",2,22],    ["PEC Zwolle",2,22],
    ["SC Heerenveen",2,22],    ["Telstar",1,12],    ["Excelsior",2,22],
    ["ADO Den Haag",2,22],    ["SC Cambuur",1,12],    ["Willem II",2,22]
  ]},
  { id:"BEL", nom:"Pro League", pays:"BEL", clubs:[
    ["Club Bruges",3,45],    ["Union SG",3,45],    ["Anderlecht",3,45],
    ["Genk",3,45],    ["Antwerp",3,45],    ["La Gantoise",3,45],
    ["Standard",3,45],    ["Cercle Bruges",2,22],    ["Westerlo",2,22],
    ["Malines",2,22],    ["OH Louvain",2,22],    ["Saint-Trond",2,22],
    ["Charleroi",2,22],    ["Zulte Waregem",2,22],    ["Beveren",2,22],
    ["Courtrai",2,22],    ["RAAL La Louviere",1,12],    ["Lommel",1,12]
  ]},
  { id:"TUR", nom:"Super Lig", pays:"TUR", clubs:[
    ["Galatasaray",4,100],    ["Fenerbahce",4,100],    ["Besiktas",3,45],
    ["Trabzonspor",3,45],    ["Istanbul Basaksehir",3,45],    ["Samsunspor",2,22],
    ["Konyaspor",2,22],    ["Kasimpasa",2,22],    ["Caykur Rizespor",2,22],
    ["Alanyaspor",2,22],    ["Gaziantep FK",2,22],    ["Eyupspor",2,22],
    ["Goztepe",2,22],    ["Kocaelispor",2,22],    ["Genclerbirligi",1,12],
    ["Erzurumspor",1,12],    ["Amed SK",1,12],    ["Corum FK",1,12]
  ]},
  { id:"SCO", nom:"Scottish Premiership", pays:"SCO", clubs:[
    ["Celtic",3,45],    ["Rangers",3,45],    ["Aberdeen",2,22],
    ["Heart of Midlothian",2,22],    ["Hibernian",2,22],    ["Dundee United",2,22],
    ["Dundee",1,12],    ["Falkirk",1,12],    ["Kilmarnock",1,12],
    ["Motherwell",1,12],    ["St Johnstone",1,12],    ["St Mirren",1,12]
  ]},
  { id:"RUS", nom:"Premier Liga (Russie)", pays:"RUS", clubs:[
    ["Zenit",3,45],    ["Spartak",3,45],    ["CSKA",3,45],
    ["Krasnodar",3,45],    ["Dynamo Moscou",3,45],    ["Lokomotiv Moscou",3,45],
    ["Krylya Sovetov",2,22],    ["Rostov",2,22],    ["Rubin Kazan",2,22],
    ["Akhmat Grozny",2,22],    ["Akron Togliatti",2,22],    ["Baltika Kaliningrad",2,22],
    ["Dynamo Makhachkala",2,22],    ["Orenburg",2,22],    ["Rodina Moskva",1,12],
    ["Fakel Voronezh",1,12]
  ]},
  { id:"GRE", nom:"Super League (Grèce)", pays:"GRE", clubs:[
    ["Olympiacos",3,45],    ["PAOK",3,45],    ["AEK Athens",3,45],
    ["Panathinaikos",3,45],    ["Aris",2,22],    ["OFI Crete",2,22],
    ["Atromitos",2,22],    ["Levadiakos",1,12],    ["Volos",2,22],
    ["Asteras Tripolis",2,22],    ["Kifisia",1,12],    ["Panetolikos",1,12],
    ["Iraklis",1,12],    ["Kalamata",1,12]
  ]},
  { id:"SUI", nom:"Super League (Suisse)", pays:"SUI", clubs:[
    ["Young Boys",3,45],    ["Basel",3,45],    ["Lugano",2,22],
    ["Servette",2,22],    ["Lucerne",2,22],    ["St. Gallen",2,22],
    ["Zurich",2,22],    ["Sion",2,22],    ["Lausanne-Sport",2,22],
    ["Grasshopper",2,22],    ["Thun",1,12],    ["Vaduz",1,12]
  ]},
  { id:"AUT", nom:"Bundesliga (Autriche)", pays:"AUT", clubs:[
    ["Red Bull Salzburg",3,45],    ["Sturm Graz",3,45],    ["Rapid Wien",2,22],
    ["Austria Wien",2,22],    ["LASK",2,22],    ["Wolfsberger AC",2,22],
    ["TSV Hartberg",1,12],    ["SCR Altach",1,12],    ["WSG Tirol",1,12],
    ["Grazer AK",1,12],    ["SV Ried",1,12],    ["Austria Lustenau",1,12]
  ]},
  { id:"UKR", nom:"Premier League (Ukraine)", pays:"UKR", clubs:[
    ["Shakhtar Donetsk",3,45],    ["Dynamo Kyiv",3,45],    ["Polissya Zhytomyr",2,22],
    ["Kryvbas Kryvyi Rih",2,22],    ["Oleksandriya",2,22],    ["Zorya Luhansk",2,22],
    ["Karpaty Lviv",2,22],    ["Rukh Lviv",1,12],    ["Kolos Kovalivka",1,12],
    ["Veres Rivne",1,12],    ["Chornomorets Odesa",2,22],    ["Obolon Kyiv",1,12],
    ["LNZ Cherkasy",1,12],    ["FC Kharkiv",2,22],    ["Kudrivka",1,12],
    ["Epitsentr Dunaivtsi",1,12],    ["Bukovyna Chernivtsi",1,12],    ["SC Poltava",1,12],
    ["Desna Chernihiv",1,12],    ["Metalurh Zaporizhzhia",1,12]
  ]}
];

/* Répartition des origines par pays du club (probabilités) */
const ORIGIN_MIX = {
  FRA: [["FRA",.55],["POR",.06],["BRA",.06],["ARG",.04],["ESP",.05],["BEL",.05],["NED",.04],["ENG",.03],["ITA",.04],["GER",.04],["ARG",.04]],
  ENG: [["ENG",.50],["BRA",.07],["ARG",.05],["POR",.06],["NED",.06],["BEL",.06],["FRA",.06],["ESP",.05],["ITA",.04],["GER",.05]],
  ESP: [["ESP",.62],["ARG",.08],["BRA",.07],["POR",.05],["FRA",.05],["NED",.03],["ITA",.03],["BEL",.03],["ENG",.02],["GER",.02]],
  ITA: [["ITA",.60],["ARG",.07],["BRA",.06],["FRA",.05],["POR",.04],["NED",.04],["BEL",.04],["ESP",.04],["ENG",.03],["GER",.03]],
  GER: [["GER",.58],["FRA",.06],["NED",.06],["BRA",.05],["ARG",.04],["POR",.04],["BEL",.05],["ESP",.04],["ENG",.04],["ITA",.04]],
  POR: [["POR",.60],["BRA",.12],["ESP",.05],["ARG",.04],["FRA",.04],["NED",.03],["ITA",.03],["ENG",.03],["GER",.03],["CIV",.03]],
  NED: [["NED",.60],["BEL",.06],["BRA",.06],["GER",.05],["FRA",.05],["ARG",.04],["ESP",.04],["ENG",.04],["ITA",.03],["POR",.03]],
  BEL: [["BEL",.56],["FRA",.09],["NED",.07],["BRA",.05],["POR",.04],["GER",.04],["ESP",.04],["CIV",.03],["ITA",.04],["ENG",.04]],
  TUR: [["TUR",.70],["BRA",.06],["GER",.05],["FRA",.04],["ARG",.03],["POR",.03],["NED",.03],["SRB",.02],["ESP",.02],["ENG",.02]],
  SCO: [["SCO",.62],["ENG",.14],["FRA",.04],["NED",.04],["BRA",.03],["ESP",.03],["POR",.03],["AUS",.02],["ITA",.02],["GER",.03]],
  RUS: [["RUS",.72],["BRA",.06],["ARG",.04],["ESP",.03],["FRA",.03],["POR",.03],["SRB",.03],["NED",.02],["GER",.02],["ENG",.02]],
  GRE: [["GRE",.66],["BRA",.06],["ARG",.05],["ESP",.05],["FRA",.04],["POR",.04],["SRB",.03],["ITA",.03],["ENG",.02],["GER",.02]],
  SUI: [["SUI",.58],["FRA",.09],["GER",.09],["ITA",.06],["POR",.05],["BRA",.04],["ESP",.03],["NED",.02],["ENG",.02],["ARG",.02]],
  AUT: [["AUT",.66],["GER",.10],["BRA",.05],["SRB",.03],["FRA",.03],["ESP",.03],["NED",.03],["ITA",.02],["POR",.02],["ENG",.03]],
  UKR: [["UKR",.74],["BRA",.06],["ARG",.03],["ESP",.03],["FRA",.03],["POR",.03],["NED",.02],["ITA",.02],["GER",.02],["ENG",.02]]
};

/* ---------- Générateur pseudo-aléatoire déterministe (seed) ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
let RNG = mulberry32(20260810);
FM.setSeed = s => { RNG = mulberry32(s); };
function rnd(){return RNG();}
function ri(min,max){return Math.floor(rnd()*(max-min+1))+min;}
function pick(arr){return arr[Math.floor(rnd()*arr.length)];}
function pickWeighted(pairs){let r=rnd(),s=0;for(const[v,w]of pairs){s+=w;if(r<=s)return v;}return pairs[pairs.length-1][0];}

/* ---------- Génération d'un joueur ---------- */
let PID = 1;
function makePlayer(clubRep, forcedPos, clubCountry){
  const origin = pickWeighted(ORIGIN_MIX[clubCountry] || ORIGIN_MIX.FRA);
  const pool = NAMES[origin] || NAMES.FRA;
  const name = pick(pool.first)+" "+pick(pool.last);
  const pos = forcedPos || pick(POSITIONS);

  // Note globale corrélée à la réputation du club
  const base = 46 + clubRep*7;                       // 53 → 81
  let overall = Math.max(38, Math.min(93, base + ri(-9, 9)));
  const age = ri(17, 35);
  // Jeunes = potentiel plus haut, note actuelle un peu plus basse
  let potential = overall;
  if (age <= 23) { potential = Math.min(94, overall + ri(2, 12)); overall = Math.max(40, overall - ri(0,4)); }
  else if (age >= 31) { overall = Math.max(40, overall - ri(0,3)); potential = overall; }

  const value = playerValue(overall, potential, age);
  const wage = Math.round((value*2.2 + overall*0.3) * 10) / 10;   // k€/semaine approx
  return {
    id: PID++, nom:name, nat:origin, pos, groupe:POS_GROUP[pos],
    age, note:overall, potentiel:potential,
    valeur:value, salaire:wage,
    forme: ri(-2,2), moral: ri(60,90),
    contrat: ri(1,4),
    buts:0, passes:0, matchs:0, transferListe:false
  };
}

function playerValue(ov, pot, age){
  // Courbe exponentielle douce : 60→~1.3M, 70→~6M, 80→~30M, 85→~66M, 90→~150M
  let v = 0.6 * Math.pow(1.17, Math.max(0, ov-55));     // M€
  if (age <= 21) v *= 1.4 + (pot-ov)*0.04;
  else if (age <= 25) v *= 1.2;
  else if (age >= 31) v *= 0.5;
  else if (age >= 29) v *= 0.78;
  return Math.max(0.2, Math.round(v*10)/10);
}
FM.playerValue = playerValue;

/* Jeune issu du centre de formation : note modeste, potentiel large.
   La réputation du club tire les deux vers le haut. */
FM.makeYouth = function(club, forcedPos){
  const rep = club && club.rep ? club.rep : 2;
  const p = makePlayer(rep, forcedPos, club && club.pays);
  p.age = ri(16, 18);
  /* Le jeune se cale sur le NIVEAU RÉEL de l'effectif, pas sur la seule
     réputation : sinon, à mesure que les joueurs réels raccrochent, la note
     médiane du monde glisse vers le barème du générateur.               */
  const notes = (club && club.joueurs && club.joueurs.length)
    ? club.joueurs.map(j=>j.note).sort((a,b)=>a-b) : null;
  const niveau = notes ? notes[Math.floor(notes.length/2)] : 40 + rep*6;
  /* Écart au niveau du club : un jeune entre sous la médiane, mais pas au
     point de tirer le monde vers le bas génération après génération. */
  p.note = Math.max(45, Math.min(80, niveau - ri(4, 13)));
  p.potentiel = Math.min(94, Math.max(p.note + 5, niveau + ri(0, 10) + (rep>=4 ? 3 : 0)));
  p.valeur = playerValue(p.note, p.potentiel, p.age);
  p.salaire = Math.round((p.valeur*2.2 + p.note*0.3)*10)/10;
  p.contrat = ri(3, 5);
  p.forme = ri(-1, 2); p.moral = ri(70, 92);
  p.jeune = true;                       /* marque « formé au club »          */
  p.buts=0; p.passes=0; p.matchs=0; p.transferListe=false; p.carriere=[];
  return p;
};

/* ---------- Génération d'un effectif équilibré (~22 joueurs) ---------- */
function makeSquad(rep, country){
  const plan = ["GB","GB","DD","DD","DG","DG","DC","DC","DC","DC",
                "MDC","MDC","MC","MC","MC","MO","MO","AD","AG","AD","BU","BU","BU"];
  return plan.map(p => makePlayer(rep, p, country));
}

/* ---------- Joueur réel (nom/poste/âge/note imposés) ---------- */
function makeRealPlayer(nom, pos, age, note){
  note = Math.max(38, Math.min(94, note));
  let potentiel = note;
  if (age <= 21) potentiel = Math.min(94, note + ri(2,9));
  else if (age <= 24) potentiel = Math.min(94, note + ri(0,3));
  const value = playerValue(note, potentiel, age);
  const wage = Math.round((value*2.2 + note*0.3) * 10) / 10;
  return {
    id: PID++, nom, nat:"", pos, groupe:POS_GROUP[pos],
    age, note, potentiel, valeur:value, salaire:wage,
    forme: ri(-2,2), moral: ri(60,90), contrat: ri(1,4),
    buts:0, passes:0, matchs:0, transferListe:false
  };
}

/* Construit un effectif à partir des données réelles, complété par de la profondeur */
function makeRealSquad(nom, rep, country){
  const data = (FM.CLUBDATA && FM.CLUBDATA[nom]);
  if (!data || !data.p || !data.p.length) return makeSquad(rep, country);
  const squad = data.p.map(([n,pos,age,note]) => makeRealPlayer(n,pos,age,note));
  // Complète la profondeur pour atteindre au moins 20 joueurs (jeunes du centre de formation)
  const need = Math.max(0, 20 - squad.length);
  const fillPos = ["DC","MC","AD","GB","BU","DG","MDC","AG"];
  for (let i=0;i<need;i++){
    const p = makePlayer(Math.max(1, rep-2), fillPos[i%fillPos.length], country);
    p.age = ri(17,20); p.note = Math.max(58, p.note-6);
    p.potentiel = Math.max(p.note, Math.min(88, p.note + ri(3,12)));
    p.valeur = playerValue(p.note, p.potentiel, p.age);
    squad.push(p);
  }
  return squad;
}

/* Couleurs d'un club (depuis les données réelles ou palette par défaut) */
function clubColors(nom){
  const d = FM.CLUBDATA && FM.CLUBDATA[nom];
  if (d && d.c && d.c.length>=2) return [d.c[0], d.c[1]];
  return ["#3a4557", "#e6edf3"];
}

/* ---------- Effectif de départ Mode Master League ----------
   Joueurs "maison" inconnus, faibles (esprit ML PES 5/6) : notes 60-70,
   quelques jeunes à potentiel. Noms génériques issus des pools.        */
/* Noms iconiques de l'effectif « maison » Master League (esprit PES 5/6),
   alignés sur les postes du plan ci-dessous (Castolo, Espimas, Minanda…). */
const ML_ICONS = [
  "Ruskin","Zubov",                          // GB, GB
  "Ivarov","Cabrera",                        // DD, DD
  "Dodo","Sackey",                           // DG, DG
  "Gordon","Bikefski","Stremer","Nyman",     // DC x4
  "Jaric","Yeboah",                          // MDC x2
  "Minanda","Hamsun","Ordaz",                // MC x3
  "Valeny","Ximelez",                        // MO x2
  "Burchet","Kruse","Lettieri",              // AD, AG, AD
  "Castolo","Espimas","Bergman"              // BU x3 (Castolo en pointe !)
];
FM.makeMasterSquad = function(country, iconic){
  const plan = ["GB","GB","DD","DD","DG","DG","DC","DC","DC","DC",
                "MDC","MDC","MC","MC","MC","MO","MO","AD","AG","AD","BU","BU","BU"];
  return plan.map((pos,i) => {
    const p = makePlayer(1, pos, country || "FRA");
    if (iconic && ML_ICONS[i]) p.nom = ML_ICONS[i];   // noms iconiques (club créé par le joueur)
    // Note volontairement basse ; un ou deux "espoirs" avec du potentiel
    const jeune = i % 5 === 0;
    p.age = jeune ? ri(17,20) : ri(21,31);
    p.note = jeune ? ri(60,66) : ri(62,70);
    p.potentiel = jeune ? Math.min(84, p.note + ri(6,16)) : Math.min(76, p.note + ri(1,6));
    p.forme = ri(-1,1);
    p.moral = ri(60,80);
    p.contrat = ri(1,3);
    p.valeur = playerValue(p.note, p.potentiel, p.age);
    p.salaire = Math.round((p.valeur*2.2 + p.note*0.3) * 10) / 10;
    return p;
  });
};
FM.ML_ICONS = ML_ICONS;

/* ---------- Agents libres ----------
   Vivier de joueurs SANS CLUB. Les noms sont de VRAIS joueurs (vétérans /
   joueurs ayant été agents libres autour de 2024-2026). Instantané approximatif :
   certains ont pu retrouver un club depuis. Complété par de jeunes espoirs
   libres (générés) pour étoffer le vivier.   [nom, poste, âge(2026), note]     */
FM.FREE_AGENT_POOL = [
  ["Sergio Ramos","DC",40,73],["Jérôme Boateng","DC",37,68],["Eric Bailly","DC",32,70],
  ["Shkodran Mustafi","DC",34,69],["Sokratis Papastathopoulos","DC",38,67],["Winston Reid","DC",38,66],
  ["Marcelo","DG",38,70],["Layvin Kurzawa","DG",34,69],["Ryan Bertrand","DG",36,67],
  ["Serge Aurier","DD",33,71],["Ashley Young","DD",40,67],["Timothy Fosu-Mensah","DD",28,70],
  ["Keylor Navas","GB",39,74],["Rui Patrício","GB",38,72],["Fernando Muslera","GB",40,70],["Sergio Rico","GB",32,70],
  ["Nemanja Matić","MDC",37,72],["Steven N'Zonzi","MDC",37,69],["Nampalys Mendy","MDC",34,70],
  ["Ivan Rakitić","MC",38,72],["Aaron Ramsey","MC",35,70],["Georginio Wijnaldum","MC",35,72],["Jordan Henderson","MDC",36,71],
  ["James Rodríguez","MO",35,74],["Christian Eriksen","MO",34,74],["Juan Mata","MO",38,68],
  ["Jesse Lingard","MO",33,70],["Dele Alli","MO",30,70],["Charly Musonda","MO",30,67],
  ["Hakim Ziyech","AD",33,73],["Adnan Januzaj","AD",31,71],["Gerard Deulofeu","AD",32,71],
  ["Alexis Sánchez","AG",37,72],["Ryan Fraser","AG",32,68],["Nathan Redmond","AG",32,70],
  ["Diego Costa","BU",37,70],["Wissam Ben Yedder","BU",35,73],["Luuk de Jong","BU",35,71],
  ["Divock Origi","BU",31,71],["Islam Slimani","BU",38,68],["Vincent Aboubakar","BU",34,72],["Isaac Success","BU",30,68]
];
FM.makeFreeAgents = function(n, country){
  n = n || 46;
  const used = (FM.state && FM.state.usedFreeAgents) ? FM.state.usedFreeAgents : [];
  const pool = FM.FREE_AGENT_POOL.filter(fa=>!used.includes(fa[0])).slice();
  // mélange (sans Math.random : Fisher-Yates via ri)
  for (let i=pool.length-1;i>0;i--){ const j=ri(0,i); const t=pool[i]; pool[i]=pool[j]; pool[j]=t; }
  const list = [];
  const take = Math.min(n, pool.length);
  for (let i=0;i<take;i++){
    const [nom,pos,age,note] = pool[i];
    const p = makeRealPlayer(nom, pos, parseInt(age,10), note);
    p.contrat = 0;                              // agent libre
    p.potentiel = p.note;                       // vétérans : plus de marge
    p.forme = ri(-1,1); p.moral = ri(55,78);
    p.valeur = playerValue(p.note, p.potentiel, p.age);
    p.salaire = Math.round((p.valeur*2.2 + p.note*0.3) * 10) / 10;
    list.push(p);
  }
  // Complément : jeunes espoirs libres (générés)
  const jeunePos = ["GB","DC","DG","DD","MDC","MC","MO","AG","AD","BU"];
  for (let i=take;i<n;i++){
    const pos = jeunePos[i % jeunePos.length];
    const p = makePlayer(2, pos, country || pick(["FRA","ESP","POR","BRA","ARG","NED","BEL","ITA","ENG"]));
    p.age = ri(18,22); p.note = ri(60,68);
    p.potentiel = Math.min(85, p.note + ri(4,12));
    p.forme = ri(-1,1); p.moral = ri(55,80); p.contrat = 0;
    p.valeur = playerValue(p.note, p.potentiel, p.age);
    p.salaire = Math.round((p.valeur*2.2 + p.note*0.3) * 10) / 10;
    list.push(p);
  }
  return list.sort((a,b)=>b.note-a.note);
};

/* ---------- Construction de la base complète ---------- */
FM.buildDatabase = function(){
  PID = 1;
  const clubs = [];
  let cid = 1;
  for (const lg of LEAGUES){
    for (const [nom, rep, budget] of lg.clubs){
      const squad = makeRealSquad(nom, rep, lg.pays);
      clubs.push({
        id: cid++, nom, ligue: lg.id, ligueNom: lg.nom, pays: lg.pays,
        couleurs: clubColors(nom),
        rep, budget: budget * (0.15 + rnd()*0.15),   // budget transferts dispo (part du budget total)
        budgetTotal: budget,
        joueurs: squad,
        formation: rep>=4 ? "4-3-3" : "4-4-2",
        tactique: { mentalite:1, tempo:1, pressing:1, largeur:1 }, // 0 bas / 1 moyen / 2 haut
        onze: [], // rempli plus tard
        pts:0, j:0, g:0, n:0, p:0, bp:0, bc:0
      });
    }
  }
  clubs.forEach(c => { c.onze = FM.autoPickXI(c); });
  return { clubs, leagues: LEAGUES };
};

/* Exports internes utiles */
FM.POSITIONS = POSITIONS;
FM.POS_GROUP = POS_GROUP;
/* Poste représentatif de chaque ligne : sert à combler un trou d'effectif */
FM.POS_BY_GROUP = { G:"GB", D:"DC", M:"MC", A:"BU" };
/* Recale le compteur d'identifiants sur une partie chargée.
   PID est une variable de module remise à 1 au chargement du script : après
   un rechargement de page, les jeunes créés par le centre de formation
   repartaient de 1 et reprenaient des identifiants DÉJÀ UTILISÉS. Deux
   joueurs partageaient alors le même id, et toute suppression « par id »
   (retour de prêt, transfert, retraite) en effaçait plusieurs d'un coup. */
FM.syncPlayerIds = function(state){
  let max = 0;
  const voir = p => { if (p && typeof p.id === "number" && p.id > max) max = p.id; };
  if (state && state.db && Array.isArray(state.db.clubs))
    for (const c of state.db.clubs) if (Array.isArray(c.joueurs)) c.joueurs.forEach(voir);
  if (state && Array.isArray(state.freeAgents)) state.freeAgents.forEach(voir);
  if (state && state.nations)
    for (const k of Object.keys(state.nations)){
      const n = state.nations[k];
      if (n && Array.isArray(n.squad)) n.squad.forEach(voir);
    }
  PID = Math.max(PID, max + 1);
  return PID;
};
FM.POS_LABEL = POS_LABEL;
FM.FORMATIONS = FORMATIONS;
FM.LEAGUES = LEAGUES;
FM._rnd = rnd; FM._ri = ri; FM._pick = pick;
FM.__NAMES = NAMES;
FM._nameFrom = function(poolKey){ const p = NAMES[poolKey] || NAMES.FRA; return pick(p.first)+" "+pick(p.last); };
