/* ============================================================
   DONNÉES RÉELLES — couleurs des clubs & effectifs réels
   Format club : { c:[couleur1, couleur2], p:[ [Nom, Poste, Âge, Note], ... ] }
   Postes : GB DC DG DD MDC MC MO AG AD BU
   Effectifs indicatifs (saisons ~2024-25) — éditables librement.
   ============================================================ */
var FM = window.FM || {};
window.FM = FM;
FM.CLUBDATA = {};

/* ---------------- LIGUE 1 ---------------- */
Object.assign(FM.CLUBDATA, {
"Paris SG": { c:["#004170","#DA291C"], p:[
  ["Gianluigi Donnarumma","GB",25,87],["Matvey Safonov","GB",25,80],
  ["Achraf Hakimi","DD",26,86],["Nuno Mendes","DG",22,84],["Marquinhos","DC",30,85],["Lucas Beraldo","DC",21,78],["Willian Pacho","DC",23,83],["Lucas Hernández","DC",29,82],
  ["Vitinha","MC",25,85],["Warren Zaïre-Emery","MC",19,82],["Fabián Ruiz","MC",29,84],["João Neves","MDC",20,83],
  ["Ousmane Dembélé","AD",28,86],["Bradley Barcola","AG",22,83],["Khvicha Kvaratskhelia","AG",24,86],["Désiré Doué","MO",20,81],["Gonçalo Ramos","BU",24,82],["Randal Kolo Muani","BU",26,81]
]},
"Marseille": { c:["#2FAEE0","#FFFFFF"], p:[
  ["Gerónimo Rulli","GB",33,80],["Pau López","GB",30,77],
  ["Jonathan Clauss","DD",32,79],["Quentin Merlin","DG",23,76],["Leonardo Balerdi","DC",26,80],["Chancel Mbemba","DC",30,79],["Derek Cornelius","DC",27,74],
  ["Adrien Rabiot","MC",30,83],["Geoffrey Kondogbia","MDC",32,79],["Valentin Rongier","MC",30,78],["Pierre-Emile Højbjerg","MC",29,82],
  ["Mason Greenwood","AD",23,82],["Amine Harit","MO",28,78],["Luis Henrique","AG",23,77],["Pierre-Emerick Aubameyang","BU",35,80],["Neal Maupay","BU",28,74]
]},
"Monaco": { c:["#E51B22","#FFFFFF"], p:[
  ["Radosław Majecki","GB",25,77],["Philipp Köhn","GB",27,76],
  ["Vanderson","DD",23,79],["Caio Henrique","DG",27,78],["Wilfried Singo","DC",24,81],["Thilo Kehrer","DC",28,79],["Mohammed Salisu","DC",25,78],
  ["Denis Zakaria","MDC",28,82],["Lamine Camara","MC",21,79],["Aleksandr Golovin","MO",29,81],["Takumi Minamino","MO",30,78],
  ["Maghnes Akliouche","AD",23,80],["Krépin Diatta","AD",26,76],["Folarin Balogun","BU",23,79],["Breel Embolo","BU",28,78],["George Ilenikhena","BU",18,73]
]},
"Lille": { c:["#E01E24","#0A2240"], p:[
  ["Lucas Chevalier","GB",23,81],["Vito Mannone","GB",37,72],
  ["Thomas Meunier","DD",33,76],["Gabriel Gudmundsson","DG",26,76],["Bafodé Diakité","DC",24,80],["Alexsandro","DC",25,78],["Aïssa Mandi","DC",33,76],
  ["Angel Gomes","MC",24,79],["Benjamin André","MDC",34,78],["Nabil Bentaleb","MC",30,77],["Ayyoub Bouaddi","MDC",17,74],
  ["Edon Zhegrova","AD",25,80],["Hákon Haraldsson","MO",21,76],["Osame Sahraoui","AG",23,76],["Jonathan David","BU",25,83],["Mohamed Bayo","BU",26,73]
]},
"Lyon": { c:["#FFFFFF","#00337F"], p:[
  ["Lucas Perri","GB",27,77],["Rémy Descamps","GB",28,72],
  ["Saïd Benrahma","AD",29,78],["Nicolás Tagliafico","DG",32,79],["Moussa Niakhaté","DC",28,78],["Duje Ćaleta-Car","DC",28,77],["Ainsley Maitland-Niles","DD",27,75],
  ["Corentin Tolisso","MC",30,80],["Maxence Caqueret","MC",25,79],["Nemanja Matić","MDC",36,78],["Tanner Tessmann","MC",23,74],
  ["Rayan Cherki","MO",21,80],["Malick Fofana","AG",20,78],["Ernest Nuamah","AG",21,76],["Alexandre Lacazette","BU",34,80],["Georges Mikautadze","BU",24,78]
]},
"Nice": { c:["#E4022E","#000000"], p:[
  ["Marcin Bułka","GB",25,78],["Yehvann Diouf","GB",25,72],
  ["Jordan Lotomba","DD",26,75],["Melvin Bard","DG",24,75],["Dante","DC",41,75],["Jean-Clair Todibo","DC",25,80],["Antoine Mendy","DD",20,73],
  ["Morgan Sanson","MC",30,76],["Hicham Boudaoui","MC",25,76],["Pablo Rosario","MDC",28,76],["Sofiane Diop","MO",25,77],
  ["Jérémie Boga","AG",28,77],["Badredine Bouanani","AD",20,74],["Terem Moffi","BU",26,78],["Gaëtan Laborde","BU",31,76],["Evann Guessand","BU",24,75]
]},
"Rennes": { c:["#E52528","#000000"], p:[
  ["Steve Mandanda","GB",40,76],["Brice Samba","GB",31,80],
  ["Hans Hateboer","DD",31,74],["Adrien Truffert","DG",23,77],["Warmed Omari","DC",24,76],["Christopher Wooh","DC",23,76],["Jérémy Jacquet","DC",19,72],
  ["Enzo Le Fée","MC",25,78],["Baptiste Santamaria","MDC",30,76],["Fabian Rieder","MO",23,76],["Ludovic Blas","MO",27,77],
  ["Amine Gouiri","BU",25,79],["Arnaud Kalimuendo","BU",23,78],["Jota","AG",26,76],["Lorenz Assignon","DD",24,75],["Albert Grønbæk","MC",23,74]
]},
"Lens": { c:["#FFE500","#E4022E"], p:[
  ["Brice Samba","GB",31,79],["Hervé Koffi","GB",28,74],
  ["Jonathan Gradit","DC",32,76],["Kevin Danso","DC",26,79],["Facundo Medina","DC",25,78],["Deiver Machado","DG",31,75],["Przemysław Frankowski","DD",29,76],
  ["Salis Abdul Samed","MDC",25,77],["Neil El Aynaoui","MC",23,75],["Andy Diouf","MC",22,75],["Adrien Thomasson","MO",31,75],
  ["Florian Sotoca","AD",34,76],["Wesley Saïd","AG",30,74],["Elye Wahi","BU",22,78],["M'Bala Nzola","BU",28,74],["Angelo Fulgini","MO",28,75]
]},
"Strasbourg": { c:["#009EE0","#FFFFFF"], p:[
  ["Matz Sels","GB",33,77],["Alaa Bellaarouch","GB",21,70],
  ["Guela Doué","DD",22,74],["Mamadou Sarr","DC",20,72],["Saïdou Sow","DC",23,73],["Marvin Senaya","DD",23,71],["Ismaël Doukouré","DC",21,73],
  ["Habib Diarra","MC",21,77],["Andrey Santos","MDC",21,75],["Sekou Mara","BU",23,73],["Dilane Bakwa","AD",22,76],
  ["Emanuel Emegha","BU",22,76],["Félix Lemaréchal","MO",20,72],["Junior Mwanga","MC",21,72],["Abakar Sylla","DC",22,72],["Caleb Wiley","DG",20,72]
]},
"Reims": { c:["#E4022E","#FFFFFF"], p:[
  ["Yehvann Diouf","GB",25,74],["Alexandre Olliero","GB",28,71],
  ["Thibault De Smet","DG",27,72],["Emmanuel Agbadou","DC",27,75],["Yunis Abdelhamid","DC",37,73],["Sergio Akieme","DG",27,72],["Cheick Keita","DD",21,71],
  ["Marshall Munetsi","MC",28,76],["Amir Richardson","MC",22,73],["Valentin Atangana","MDC",19,72],["Teddy Teuma","MC",31,74],
  ["Keito Nakamura","AG",24,75],["Junya Ito","AD",31,76],["Mohamed Daramy","AG",22,74],["Oumar Diakité","BU",21,71],["Amadou Koné","BU",20,70]
]},
"Nantes": { c:["#FDE500","#009540"], p:[
  ["Alban Lafont","GB",26,77],["Anthony Lopes","GB",34,75],
  ["Nicolas Cozza","DC",26,73],["Jean-Charles Castelletto","DC",30,74],["Nathan Zézé","DC",19,72],["Fabien Centonze","DD",29,72],["Bastien Meupiyou","DC",18,70],
  ["Pedro Chirivella","MDC",28,74],["Douglas Augusto","MC",27,73],["Moses Simon","AG",29,76],["Johann Lepenant","MC",22,73],
  ["Matthis Abline","BU",22,74],["Mostafa Mohamed","BU",27,74],["Kader Bamba","AD",30,71],["Herba Guirassy","MC",20,70],["Sorba Thomas","AD",26,73]
]},
"Toulouse": { c:["#7B2D8E","#FFFFFF"], p:[
  ["Guillaume Restes","GB",20,76],["Thomas Himeur","GB",22,70],
  ["Rasmus Nicolaisen","DC",27,73],["Kevin Keben","DC",22,72],["Mikkel Desler","DD",29,72],["Gabriel Suazo","DG",27,74],["Charlie Cresswell","DC",22,74],
  ["Vincent Sierro","MC",29,75],["Stijn Spierings","MDC",28,73],["Cristian Cásseres","MC",25,73],["Aron Dønnum","AD",26,73],
  ["Yann Gboho","AG",24,73],["Frank Magri","BU",25,73],["Zakaria Aboukhlal","AD",25,76],["Shavy Babicka","AG",21,71],["Djibril Sidibé","DD",32,71]
]},
"Brest": { c:["#E4022E","#FFFFFF"], p:[
  ["Marco Bizot","GB",34,76],["Grégoire Coudert","GB",25,72],
  ["Kenny Lala","DD",33,73],["Bradley Locko","DG",23,74],["Brendan Chardonnet","DC",30,75],["Lilian Brassier","DC",25,74],["Soumaïla Coulibaly","DC",21,72],
  ["Pierre Lees-Melou","MC",31,76],["Mahdi Camara","MC",27,74],["Hugo Magnetti","MDC",27,73],["Romain Del Castillo","MO",29,75],
  ["Ludovic Ajorque","BU",31,76],["Jérémy Le Douaron","BU",27,73],["Kamory Doumbia","MO",22,73],["Abdallah Sima","AG",23,74],["Mathias Pereira Lage","AD",28,72]
]},
"Montpellier": { c:["#003DA5","#F58220"], p:[
  ["Benjamin Lecomte","GB",33,74],["Dimitry Bertaud","GB",26,72],
  ["Enzo Tchato","DD",22,72],["Issiaga Sylla","DG",31,71],["Théo Sainte-Luce","DC",23,71],["Kiki Kouyaté","DC",28,73],["Maxime Estève","DC",22,73],
  ["Jordan Ferri","MC",32,73],["Téji Savanier","MO",33,76],["Joris Chotard","MDC",23,73],["Khalil Fayad","MO",21,72],
  ["Arnaud Nordin","AD",26,72],["Wahbi Khazri","MO",34,72],["Akor Adams","BU",25,73],["Musa Al-Taamari","AD",27,74],["Becir Omeragic","DC",23,72]
]},
"Le Havre": { c:["#003DA5","#87CEEB"], p:[
  ["Mory Diaw","GB",31,72],["Arthur Desmas","GB",30,70],
  ["Yoann Salmier","DC",32,71],["Arouna Sangante","DC",22,72],["Gautier Lloris","DC",27,71],["Etienne Youté","DC",22,70],["Yassine Kechta","AD",22,70],
  ["Rassoul Ndiaye","MDC",23,71],["Daler Kuzyaev","MC",32,72],["Abdoulaye Touré","MC",31,73],["Antoine Joujou","MO",22,70],
  ["Simon Ebonog","BU",22,69],["Josué Casimir","AG",24,70],["Ayman Kari","MC",20,70],["Emmanuel Sabbi","AG",27,71],["André Ayew","BU",35,72]
]},
"Auxerre": { c:["#0055A5","#FFFFFF"], p:[
  ["Donovan Léon","GB",32,72],["Théo De Percin","GB",24,69],
  ["Paul Joly","DD",26,71],["Clément Akpa","DG",25,70],["Jubal","DC",31,71],["Gideon Mensah","DG",26,71],["Marcelin Danois","DC",21,69],
  ["Lassine Sinayoko","AG",25,73],["Gaëtan Perrin","MO",28,73],["Kevin Danois","MC",22,70],["Elisha Owusu","MDC",27,72],
  ["Hamed Traoré","MO",24,74],["Sinaly Diomandé","DC",23,71],["Théo Bair","BU",25,71],["Rémy Dugimont","BU",38,69],["Josué Casimir","AD",24,70]
]}
});

/* ---------------- PREMIER LEAGUE ---------------- */
Object.assign(FM.CLUBDATA, {
"Manchester City": { c:["#6CABDD","#1C2C5B"], p:[
  ["Ederson","GB",31,86],["Stefan Ortega","GB",32,79],
  ["Kyle Walker","DD",34,82],["Joško Gvardiol","DG",23,85],["Rúben Dias","DC",28,87],["Manuel Akanji","DC",29,84],["Nathan Aké","DC",30,82],["Rico Lewis","DD",20,80],
  ["Rodri","MDC",28,91],["Mateo Kovačić","MC",30,83],["Bernardo Silva","MC",30,86],["Ilkay Gündogan","MO",34,83],["Matheus Nunes","MC",26,80],
  ["Phil Foden","MO",25,88],["Jérémy Doku","AG",23,83],["Savinho","AD",21,81],["Erling Haaland","BU",25,91],["Omar Marmoush","BU",26,82]
]},
"Arsenal": { c:["#EF0107","#FFFFFF"], p:[
  ["David Raya","GB",29,85],["Neto","GB",35,77],
  ["Ben White","DD",27,84],["Jurriën Timber","DD",24,82],["William Saliba","DC",24,87],["Gabriel Magalhães","DC",27,86],["Riccardo Calafiori","DG",23,81],["Myles Lewis-Skelly","DG",18,78],
  ["Declan Rice","MC",26,88],["Martin Ødegaard","MO",26,87],["Thomas Partey","MDC",31,83],["Mikel Merino","MC",29,82],
  ["Bukayo Saka","AD",23,88],["Gabriel Martinelli","AG",24,84],["Leandro Trossard","AG",30,82],["Kai Havertz","BU",26,84],["Gabriel Jesus","BU",28,82],["Raheem Sterling","AG",30,80]
]},
"Liverpool": { c:["#C8102E","#FFFFFF"], p:[
  ["Alisson","GB",32,89],["Caoimhín Kelleher","GB",26,79],
  ["Trent Alexander-Arnold","DD",26,86],["Andrew Robertson","DG",31,84],["Virgil van Dijk","DC",34,89],["Ibrahima Konaté","DC",26,85],["Jarell Quansah","DC",22,79],["Kostas Tsimikas","DG",29,79],
  ["Alexis Mac Allister","MC",26,86],["Ryan Gravenberch","MDC",23,83],["Dominik Szoboszlai","MO",24,84],["Curtis Jones","MC",24,81],["Wataru Endo","MDC",32,80],
  ["Mohamed Salah","AD",33,90],["Luis Díaz","AG",28,85],["Cody Gakpo","AG",26,83],["Darwin Núñez","BU",26,82],["Diogo Jota","BU",28,83]
]},
"Chelsea": { c:["#034694","#FFFFFF"], p:[
  ["Robert Sánchez","GB",28,80],["Filip Jörgensen","GB",23,77],
  ["Reece James","DD",25,84],["Marc Cucurella","DG",27,82],["Levi Colwill","DC",22,82],["Wesley Fofana","DC",24,82],["Benoît Badiashile","DC",24,80],["Malo Gusto","DD",22,80],
  ["Enzo Fernández","MC",24,84],["Moisés Caicedo","MDC",23,85],["Roméo Lavia","MDC",21,80],["Cole Palmer","MO",23,87],
  ["Noni Madueke","AD",23,80],["Pedro Neto","AD",25,82],["Jadon Sancho","AG",25,80],["Nicolas Jackson","BU",24,81],["Christopher Nkunku","BU",27,83],["João Félix","MO",25,81]
]},
"Manchester Utd": { c:["#DA291C","#000000"], p:[
  ["André Onana","GB",29,83],["Altay Bayındır","GB",27,76],
  ["Diogo Dalot","DD",26,82],["Noussair Mazraoui","DD",27,81],["Lisandro Martínez","DC",27,84],["Matthijs de Ligt","DC",25,84],["Harry Maguire","DC",32,80],["Luke Shaw","DG",30,81],
  ["Bruno Fernandes","MO",30,87],["Casemiro","MDC",33,82],["Kobbie Mainoo","MC",20,82],["Manuel Ugarte","MDC",24,81],
  ["Amad Diallo","AD",23,80],["Alejandro Garnacho","AG",21,82],["Marcus Rashford","AG",27,83],["Rasmus Højlund","BU",22,80],["Joshua Zirkzee","BU",24,79],["Mason Mount","MO",26,80]
]},
"Tottenham": { c:["#132257","#FFFFFF"], p:[
  ["Guglielmo Vicario","GB",29,83],["Fraser Forster","GB",37,75],
  ["Pedro Porro","DD",25,82],["Destiny Udogie","DG",22,81],["Cristian Romero","DC",27,85],["Micky van de Ven","DC",24,83],["Radu Drăgușin","DC",23,78],
  ["James Maddison","MO",28,84],["Rodrigo Bentancur","MC",28,81],["Pape Matar Sarr","MC",23,80],["Yves Bissouma","MDC",29,80],
  ["Dejan Kulusevski","AD",25,84],["Brennan Johnson","AD",24,80],["Son Heung-min","AG",33,85],["Timo Werner","AG",29,79],["Dominic Solanke","BU",28,82],["Richarlison","BU",28,80]
]},
"Newcastle": { c:["#241F20","#FFFFFF"], p:[
  ["Nick Pope","GB",33,81],["Martin Dúbravka","GB",36,76],
  ["Kieran Trippier","DD",34,81],["Tino Livramento","DD",22,80],["Sven Botman","DC",25,83],["Fabian Schär","DC",33,81],["Dan Burn","DC",33,79],["Lewis Hall","DG",20,78],
  ["Bruno Guimarães","MC",27,86],["Sandro Tonali","MDC",25,84],["Joelinton","MC",29,82],["Sean Longstaff","MC",27,78],
  ["Jacob Murphy","AD",30,78],["Anthony Gordon","AG",24,83],["Harvey Barnes","AG",27,79],["Alexander Isak","BU",25,86],["Callum Wilson","BU",33,79]
]},
"Aston Villa": { c:["#670E36","#95BFE5"], p:[
  ["Emiliano Martínez","GB",32,85],["Robin Olsen","GB",35,74],
  ["Matty Cash","DD",27,79],["Lucas Digne","DG",31,79],["Ezri Konsa","DC",27,81],["Pau Torres","DC",28,82],["Tyrone Mings","DC",32,79],["Ian Maatsen","DG",23,78],
  ["Boubacar Kamara","MDC",25,82],["John McGinn","MC",30,81],["Youri Tielemans","MC",28,82],["Amadou Onana","MC",23,81],
  ["Leon Bailey","AD",28,81],["Morgan Rogers","MO",23,80],["Jacob Ramsey","MC",24,78],["Ollie Watkins","BU",29,84],["Jhon Durán","BU",21,80]
]},
"Brighton": { c:["#0057B8","#FFFFFF"], p:[
  ["Bart Verbruggen","GB",23,80],["Jason Steele","GB",35,72],
  ["Joël Veltman","DD",33,78],["Pervis Estupiñán","DG",27,80],["Lewis Dunk","DC",33,80],["Jan Paul van Hecke","DC",25,79],["Igor Julio","DC",27,77],["Tariq Lamptey","DD",24,76],
  ["Carlos Baleba","MDC",21,80],["Pascal Groß","MC",34,80],["Kaoru Mitoma","AG",28,83],["Yankuba Minteh","AD",20,78],
  ["Simon Adingra","AG",23,79],["João Pedro","BU",23,81],["Danny Welbeck","BU",34,78],["Georginio Rutter","MO",23,79],["Julio Enciso","MO",21,77]
]},
"West Ham": { c:["#7A263A","#1BB1E7"], p:[
  ["Alphonse Areola","GB",32,80],["Łukasz Fabiański","GB",40,73],
  ["Vladimír Coufal","DD",33,77],["Emerson","DG",31,77],["Max Kilman","DC",28,80],["Konstantinos Mavropanos","DC",27,79],["Aaron Wan-Bissaka","DD",27,79],["Nayef Aguerd","DC",29,79],
  ["Edson Álvarez","MDC",27,81],["Tomáš Souček","MC",30,80],["Lucas Paquetá","MO",28,83],["Guido Rodríguez","MDC",31,78],
  ["Mohammed Kudus","AD",25,83],["Crysencio Summerville","AG",23,79],["Jarrod Bowen","AD",28,83],["Michail Antonio","BU",35,76],["Niclas Füllkrug","BU",32,80]
]},
"Everton": { c:["#003399","#FFFFFF"], p:[
  ["Jordan Pickford","GB",31,82],["João Virgínia","GB",25,72],
  ["Séamus Coleman","DD",36,74],["Vitalii Mykolenko","DG",26,77],["James Tarkowski","DC",32,80],["Jarrad Branthwaite","DC",23,81],["Michael Keane","DC",32,76],
  ["Idrissa Gueye","MDC",35,78],["James Garner","MC",24,77],["Abdoulaye Doucouré","MC",32,79],["Orel Mangala","MC",27,77],
  ["Dwight McNeil","AG",25,79],["Jack Harrison","AD",28,77],["Iliman Ndiaye","MO",25,78],["Dominic Calvert-Lewin","BU",28,79],["Beto","BU",27,76]
]},
"Crystal Palace": { c:["#1B458F","#C4122E"], p:[
  ["Dean Henderson","GB",28,80],["Remi Matthews","GB",31,70],
  ["Daniel Muñoz","DD",29,78],["Tyrick Mitchell","DG",26,78],["Marc Guéhi","DC",25,83],["Maxence Lacroix","DC",25,79],["Chris Richards","DC",25,78],
  ["Adam Wharton","MDC",21,80],["Will Hughes","MC",30,76],["Jefferson Lerma","MDC",30,78],["Daichi Kamada","MO",29,79],
  ["Ismaïla Sarr","AD",27,79],["Eberechi Eze","MO",27,83],["Jean-Philippe Mateta","BU",28,80],["Odsonne Édouard","BU",27,76],["Jordan Ayew","BU",34,76]
]},
"Fulham": { c:["#FFFFFF","#000000"], p:[
  ["Bernd Leno","GB",33,81],["Steven Benda","GB",26,70],
  ["Kenny Tete","DD",29,77],["Antonee Robinson","DG",28,80],["Calvin Bassey","DC",25,79],["Joachim Andersen","DC",29,80],["Issa Diop","DC",28,76],
  ["Sasa Lukic","MDC",29,78],["Sander Berge","MC",27,79],["Andreas Pereira","MO",29,80],["Tom Cairney","MC",34,76],
  ["Harry Wilson","AD",28,78],["Alex Iwobi","AG",29,80],["Emile Smith Rowe","MO",25,78],["Raúl Jiménez","BU",34,78],["Rodrigo Muniz","BU",24,78]
]},
"Brentford": { c:["#E30613","#FFFFFF"], p:[
  ["Mark Flekken","GB",32,79],["Hákon Valdimarsson","GB",23,71],
  ["Aaron Hickey","DD",23,77],["Rico Henry","DG",28,78],["Nathan Collins","DC",24,80],["Ethan Pinnock","DC",32,78],["Kristoffer Ajer","DC",27,77],["Mads Roerslev","DD",26,74],
  ["Christian Nørgaard","MDC",31,79],["Vitaly Janelt","MC",27,77],["Mathias Jensen","MC",29,77],["Yehor Yarmoliuk","MC",21,74],
  ["Bryan Mbeumo","AD",26,83],["Kevin Schade","AG",23,77],["Yoane Wissa","BU",28,80],["Igor Thiago","BU",24,76],["Fábio Carvalho","MO",23,75]
]},
"Wolves": { c:["#FDB913","#231F20"], p:[
  ["José Sá","GB",32,79],["Sam Johnstone","GB",32,76],
  ["Nélson Semedo","DD",31,78],["Rayan Aït-Nouri","DG",24,80],["Craig Dawson","DC",35,75],["Toti Gomes","DC",26,77],["Yerson Mosquera","DC",24,75],["Matt Doherty","DD",33,73],
  ["João Gomes","MDC",24,80],["Mario Lemina","MC",31,79],["Boubacar Traoré","MC",23,74],["André","MDC",23,78],
  ["Matheus Cunha","MO",26,83],["Jørgen Strand Larsen","BU",25,78],["Hwang Hee-chan","AG",29,79],["Gonçalo Guedes","AG",28,77],["Pablo Sarabia","AD",33,76]
]},
"Nottingham": { c:["#DD0000","#FFFFFF"], p:[
  ["Matz Sels","GB",33,79],["Carlos Miguel","GB",26,72],
  ["Ola Aina","DD",28,78],["Alex Moreno","DG",32,76],["Murillo","DC",23,81],["Nikola Milenković","DC",27,80],["Morato","DC",24,75],["Neco Williams","DG",24,76],
  ["Elliot Anderson","MC",22,79],["Ryan Yates","MDC",27,76],["Nicolás Domínguez","MC",27,77],["Morgan Gibbs-White","MO",25,81],
  ["Anthony Elanga","AD",23,80],["Callum Hudson-Odoi","AG",24,78],["Chris Wood","BU",33,80],["Taiwo Awoniyi","BU",28,77],["Ramón Sosa","AG",22,74]
]}
});

/* ---------------- LA LIGA ---------------- */
Object.assign(FM.CLUBDATA, {
"Real Madrid": { c:["#FFFFFF","#FEBE10"], p:[
  ["Thibaut Courtois","GB",33,88],["Andriy Lunin","GB",26,80],
  ["Dani Carvajal","DD",33,84],["Ferland Mendy","DG",30,82],["Éder Militão","DC",27,85],["Antonio Rüdiger","DC",32,85],["David Alaba","DC",33,82],["Fran García","DG",25,78],
  ["Jude Bellingham","MO",22,89],["Federico Valverde","MC",27,88],["Aurélien Tchouaméni","MDC",25,85],["Eduardo Camavinga","MC",22,85],["Luka Modrić","MC",39,82],
  ["Vinícius Júnior","AG",25,90],["Rodrygo","AD",24,86],["Brahim Díaz","MO",26,82],["Kylian Mbappé","BU",26,91],["Endrick","BU",19,79]
]},
"Barcelone": { c:["#A50044","#004D98"], p:[
  ["Marc-André ter Stegen","GB",33,86],["Iñaki Peña","GB",26,79],
  ["Jules Koundé","DD",26,85],["Alejandro Balde","DG",22,83],["Pau Cubarsí","DC",18,82],["Íñigo Martínez","DC",34,82],["Ronald Araújo","DC",26,84],["Andreas Christensen","DC",29,81],
  ["Pedri","MC",22,87],["Frenkie de Jong","MC",28,86],["Gavi","MC",21,84],["Marc Casadó","MDC",22,79],["Fermín López","MO",22,80],
  ["Lamine Yamal","AD",18,88],["Raphinha","AG",28,86],["Dani Olmo","MO",27,84],["Robert Lewandowski","BU",37,86],["Ferran Torres","BU",25,81]
]},
"Atlético": { c:["#CB3524","#FFFFFF"], p:[
  ["Jan Oblak","GB",32,86],["Juan Musso","GB",31,77],
  ["Nahuel Molina","DD",27,80],["Reinildo Mandava","DG",31,78],["José María Giménez","DC",30,82],["Robin Le Normand","DC",28,82],["César Azpilicueta","DC",36,78],["Javi Galán","DG",30,77],
  ["Rodrigo De Paul","MC",31,83],["Koke","MC",33,81],["Pablo Barrios","MC",22,80],["Marcos Llorente","MC",30,82],["Conor Gallagher","MC",25,81],
  ["Antoine Griezmann","MO",34,86],["Julián Álvarez","BU",25,86],["Alexander Sørloth","BU",29,81],["Ángel Correa","AD",30,80],["Giuliano Simeone","AD",22,78]
]},
"Athletic Bilbao": { c:["#EE2523","#FFFFFF"], p:[
  ["Unai Simón","GB",28,84],["Julen Agirrezabala","GB",24,78],
  ["Óscar de Marcos","DD",36,76],["Yuri Berchiche","DG",35,77],["Dani Vivian","DC",25,81],["Aitor Paredes","DC",25,78],["Iñigo Lekue","DD",31,74],
  ["Mikel Vesga","MDC",32,76],["Oihan Sancet","MO",25,82],["Mikel Jauregizar","MC",21,77],["Beñat Prados","MC",23,75],
  ["Nico Williams","AG",23,85],["Iñaki Williams","AD",31,82],["Álex Berenguer","AG",30,78],["Gorka Guruzeta","BU",29,77],["Maroan Sannadi","BU",24,74]
]},
"Real Sociedad": { c:["#0067B1","#FFFFFF"], p:[
  ["Álex Remiro","GB",30,83],["Unai Marrero","GB",22,72],
  ["Hamari Traoré","DD",33,78],["Aihen Muñoz","DG",28,76],["Igor Zubeldia","DC",28,80],["Nayef Aguerd","DC",29,79],["Jon Aramburu","DD",22,75],
  ["Martín Zubimendi","MDC",26,84],["Brais Méndez","MO",28,81],["Beñat Turrientes","MC",23,76],["Sergio Gómez","DG",24,77],
  ["Takefusa Kubo","AD",24,84],["Ander Barrenetxea","AG",23,78],["Mikel Oyarzabal","BU",28,84],["Orri Óskarsson","BU",21,77],["Sheraldo Becker","AD",30,76]
]},
"Villarreal": { c:["#FFE667","#004990"], p:[
  ["Diego Conde","GB",26,76],["Luiz Júnior","GB",24,74],
  ["Kiko Femenía","DD",34,75],["Sergi Cardona","DG",26,76],["Raúl Albiol","DC",40,76],["Juan Foyth","DC",27,81],["Rafa Marín","DC",23,76],["Willy Kambwala","DC",21,75],
  ["Dani Parejo","MC",36,80],["Santi Comesaña","MC",29,77],["Thomas Partey","MDC",31,80],["Álex Baena","MO",24,82],
  ["Yeremy Pino","AD",23,80],["Nicolas Pépé","AG",30,78],["Ayoze Pérez","MO",32,78],["Gerard Moreno","BU",33,80],["Thierno Barry","BU",22,76]
]},
"Betis": { c:["#00954C","#FFFFFF"], p:[
  ["Rui Silva","GB",31,79],["Adrián","GB",38,73],
  ["Héctor Bellerín","DD",30,77],["Romain Perraud","DG",27,76],["Marc Bartra","DC",34,77],["Natan","DC",24,77],["Diego Llorente","DC",32,77],["Ricardo Rodríguez","DG",33,74],
  ["Marc Roca","MDC",28,77],["Johnny Cardoso","MDC",23,78],["Sergi Altimira","MC",23,75],["Giovani Lo Celso","MO",29,80],["Isco","MO",33,82],
  ["Antony","AD",25,80],["Abde Ezzalzouli","AG",23,78],["Cucho Hernández","BU",26,78],["Cédric Bakambu","BU",34,74],["Vitor Roque","BU",20,77]
]},
"Valence": { c:["#FFFFFF","#F18E00"], p:[
  ["Giorgi Mamardashvili","GB",24,82],["Stole Dimitrievski","GB",31,74],
  ["Thierry Correia","DD",26,76],["José Gayà","DG",30,79],["Cristhian Mosquera","DC",21,78],["Mouctar Diakhaby","DC",28,77],["César Tárrega","DC",23,74],
  ["Pepelu","MDC",27,77],["Javi Guerra","MC",22,79],["André Almeida","MC",25,75],["Luis Rioja","AG",31,74],
  ["Diego López","AG",23,76],["Rafa Mir","BU",28,76],["Hugo Duro","BU",26,77],["Dani Gómez","BU",27,73],["Fran Pérez","AD",22,74]
]},
"Séville": { c:["#FFFFFF","#D91A21"], p:[
  ["Ørjan Nyland","GB",34,76],["Álvaro Fernández","GB",22,74],
  ["Jesús Navas","DD",39,75],["Adrià Pedrosa","DG",27,74],["Loïc Badé","DC",25,80],["Kike Salas","DC",23,75],["Nemanja Gudelj","DC",33,76],["Marcão","DC",29,75],
  ["Nemanja Gudelj","MDC",33,76],["Djibril Sow","MC",28,77],["Saúl Ñíguez","MC",30,78],["Lucas Ocampos","AD",31,77],
  ["Dodi Lukébakio","AD",27,79],["Isaac Romero","BU",25,75],["Kelechi Iheanacho","BU",28,75],["Chidera Ejuke","AG",27,74],["Stanis Idumbo","AG",20,72]
]},
"Girona": { c:["#D0103A","#FFFFFF"], p:[
  ["Paulo Gazzaniga","GB",33,78],["Ismael Álvarez","GB",22,71],
  ["Arnau Martínez","DD",22,77],["Miguel Gutiérrez","DG",24,79],["Daley Blind","DC",35,76],["David López","DC",35,74],["Ladislav Krejčí","DC",26,78],
  ["Yangel Herrera","MC",27,78],["Iván Martín","MC",26,75],["Donny van de Beek","MO",28,76],["Yáser Asprilla","MO",22,75],
  ["Bryan Gil","AG",24,76],["Portu","AD",33,74],["Cristhian Stuani","BU",39,74],["Bojan Miovski","BU",26,76],["Abel Ruiz","BU",25,74]
]},
"Getafe": { c:["#005999","#FFFFFF"], p:[
  ["David Soria","GB",32,78],["Jiří Letáček","GB",28,70],
  ["Damián Suárez","DD",37,74],["Diego Rico","DG",32,73],["Domingos Duarte","DC",30,75],["Djené","DC",34,76],["Omar Alderete","DC",28,75],
  ["Luis Milla","MC",30,74],["Mario Martín","MC",21,72],["Christantus Uche","MC",21,74],["Coba da Costa","AG",21,71],
  ["Álex Sola","AD",24,72],["Borja Mayoral","BU",28,78],["Mauro Arambarri","MC",29,77],["Peter Federico","AD",23,72],["Juanmi Latasa","BU",24,73]
]},
"Osasuna": { c:["#D91A21","#0A346F"], p:[
  ["Sergio Herrera","GB",32,76],["Aitor Fernández","GB",34,73],
  ["Jesús Areso","DD",26,75],["Juan Cruz","DG",29,73],["Alejandro Catena","DC",31,75],["Enzo Boyomo","DC",24,74],["Unai García","DC",33,74],
  ["Lucas Torró","MDC",31,75],["Jon Moncayola","MC",27,77],["Aimar Oroz","MO",24,77],["Moi Gómez","MC",31,74],
  ["Rubén García","AG",32,74],["Bryan Zaragoza","AG",24,77],["Ante Budimir","BU",34,78],["Raúl García de Haro","BU",27,72],["Abel Bretones","DG",25,72]
]},
"Celta Vigo": { c:["#8AC3EE","#FFFFFF"], p:[
  ["Vicente Guaita","GB",38,76],["Ionuț Radu","GB",28,75],
  ["Óscar Mingueza","DD",26,77],["Carl Starfelt","DC",30,75],["Marcos Alonso","DC",34,75],["Joseph Aidoo","DC",29,74],["Javi Rodríguez","DG",22,72],
  ["Fran Beltrán","MDC",26,76],["Ilaix Moriba","MC",22,74],["Hugo Sotelo","MC",21,72],["Luca de la Torre","MC",27,75],
  ["Óscar Rodríguez","MO",27,74],["Iago Aspas","BU",38,79],["Borja Iglesias","BU",32,77],["Williot Swedberg","AG",21,74],["Jonathan Bamba","AG",29,76]
]},
"Rayo Vallecano": { c:["#FFFFFF","#E53027"], p:[
  ["Augusto Batalla","GB",29,76],["Dani Cárdenas","GB",27,71],
  ["Andrei Rațiu","DD",27,77],["Pep Chavarría","DG",27,73],["Florian Lejeune","DC",34,76],["Aridane Hernández","DC",36,73],["Abdul Mumin","DC",27,74],
  ["Óscar Valentín","MDC",31,75],["Pedro Díaz","MC",25,73],["Isi Palazón","AD",30,78],["Unai López","MC",30,74],
  ["Álvaro García","AG",32,76],["Jorge de Frutos","AD",28,76],["Sergio Camello","BU",24,75],["Randy Nteka","BU",27,72],["Raúl de Tomás","BU",30,75]
]},
"Mallorca": { c:["#E20613","#000000"], p:[
  ["Dominik Greif","GB",28,76],["Leo Román","GB",25,73],
  ["Pablo Maffeo","DD",28,77],["Johan Mojica","DG",33,75],["Antonio Raíllo","DC",34,77],["Martin Valjent","DC",30,76],["Copete","DC",26,74],
  ["Sergi Darder","MC",32,77],["Samú Costa","MDC",25,76],["Antonio Sánchez","MC",28,73],["Manu Morlanes","MC",26,74],
  ["Dani Rodríguez","MO",37,73],["Takuma Asano","AD",31,74],["Vedat Muriqi","BU",31,79],["Abdón Prats","BU",33,73],["Mateo Joseph","BU",22,74]
]},
"Las Palmas": { c:["#FFE500","#004B87"], p:[
  ["Jasper Cillessen","GB",36,76],["Dinko Horkaš","GB",28,71],
  ["Álex Suárez","DD",27,73],["Sergi Cardona","DG",26,74],["Scott McKenna","DC",29,74],["Mika Mármol","DC",24,74],["Álvaro Valles","GB",28,74],
  ["Kirian Rodríguez","MC",29,75],["Enzo Loiodice","MC",24,73],["Javi Muñoz","MC",26,72],["Alberto Moleiro","MO",22,77],
  ["Sandro Ramírez","BU",30,73],["Fábio Silva","BU",23,76],["Marc Cardona","BU",29,72],["Manu Fuster","AG",26,72],["Adnan Januzaj","AD",30,74]
]}
});

/* ---------------- SERIE A ---------------- */
Object.assign(FM.CLUBDATA, {
"Inter": { c:["#0068A8","#000000"], p:[
  ["Yann Sommer","GB",36,84],["Josep Martínez","GB",27,78],
  ["Denzel Dumfries","DD",29,82],["Federico Dimarco","DG",27,84],["Alessandro Bastoni","DC",26,86],["Francesco Acerbi","DC",37,81],["Stefan de Vrij","DC",33,80],["Benjamin Pavard","DC",29,82],
  ["Nicolò Barella","MC",28,86],["Hakan Çalhanoğlu","MDC",31,85],["Henrikh Mkhitaryan","MC",36,81],["Piotr Zieliński","MC",31,81],["Davide Frattesi","MC",25,81],
  ["Lautaro Martínez","BU",28,88],["Marcus Thuram","BU",28,85],["Mehdi Taremi","BU",33,80],["Marko Arnautović","BU",36,76],["Carlos Augusto","DG",26,79]
]},
"Juventus": { c:["#000000","#FFFFFF"], p:[
  ["Michele Di Gregorio","GB",28,82],["Mattia Perin","GB",32,78],
  ["Danilo","DD",34,80],["Andrea Cambiaso","DG",25,82],["Gleison Bremer","DC",28,85],["Federico Gatti","DC",27,80],["Pierre Kalulu","DC",25,80],["Lloyd Kelly","DC",27,77],
  ["Manuel Locatelli","MDC",27,82],["Khéphren Thuram","MC",24,81],["Teun Koopmeiners","MC",27,83],["Weston McKennie","MC",27,80],["Douglas Luiz","MC",27,81],
  ["Nico González","AD",27,81],["Kenan Yıldız","MO",20,81],["Francisco Conceição","AD",22,79],["Dušan Vlahović","BU",25,84],["Timothy Weah","AD",25,78]
]},
"Milan": { c:["#FB090B","#000000"], p:[
  ["Mike Maignan","GB",30,86],["Marco Sportiello","GB",33,76],
  ["Emerson Royal","DD",26,79],["Theo Hernández","DG",28,85],["Fikayo Tomori","DC",27,82],["Malick Thiaw","DC",24,80],["Matteo Gabbia","DC",25,79],["Alessandro Florenzi","DD",34,76],
  ["Tijjani Reijnders","MC",27,83],["Youssouf Fofana","MDC",26,81],["Ruben Loftus-Cheek","MC",29,80],["Yunus Musah","MC",22,78],
  ["Christian Pulišić","AD",27,84],["Rafael Leão","AG",26,86],["Samuel Chukwueze","AD",26,79],["Álvaro Morata","BU",33,81],["Tammy Abraham","BU",28,79]
]},
"Napoli": { c:["#12A0D7","#FFFFFF"], p:[
  ["Alex Meret","GB",28,82],["Elia Caprile","GB",24,76],
  ["Giovanni Di Lorenzo","DD",32,83],["Leonardo Spinazzola","DG",32,78],["Amir Rrahmani","DC",31,81],["Alessandro Buongiorno","DC",26,82],["Juan Jesus","DC",34,76],["Mathías Olivera","DG",27,79],
  ["Stanislav Lobotka","MDC",30,84],["Scott McTominay","MC",28,83],["Frank Anguissa","MC",29,82],["Billy Gilmour","MC",24,78],
  ["Matteo Politano","AD",32,80],["David Neres","AG",28,80],["Khvicha Kvaratskhelia","AG",24,86],["Romelu Lukaku","BU",32,83],["Giacomo Raspadori","BU",25,79]
]},
"Roma": { c:["#8E1F2F","#F0BC42"], p:[
  ["Mile Svilar","GB",26,81],["Pierluigi Gollini","GB",30,74],
  ["Zeki Çelik","DD",28,77],["Angeliño","DG",28,80],["Gianluca Mancini","DC",29,81],["Evan Ndicka","DC",26,81],["Mats Hummels","DC",36,79],
  ["Bryan Cristante","MDC",30,80],["Manu Koné","MC",24,81],["Lorenzo Pellegrini","MO",29,81],["Leandro Paredes","MC",31,80],["Niccolò Pisilli","MC",20,74],
  ["Paulo Dybala","MO",32,84],["Stephan El Shaarawy","AG",33,77],["Alexis Saelemaekers","AD",26,78],["Artem Dovbyk","BU",28,81],["Eldor Shomurodov","BU",30,75]
]},
"Atalanta": { c:["#1E71B8","#000000"], p:[
  ["Marco Carnesecchi","GB",25,81],["Juan Musso","GB",31,77],
  ["Davide Zappacosta","DD",33,78],["Matteo Ruggeri","DG",23,79],["Isak Hien","DC",26,81],["Berat Djimsiti","DC",32,79],["Sead Kolašinac","DC",32,78],["Raoul Bellanova","DD",25,80],
  ["Marten de Roon","MDC",34,80],["Éderson","MC",26,84],["Mario Pašalić","MO",30,80],["Marco Brescianini","MC",25,77],
  ["Ademola Lookman","AG",28,85],["Charles De Ketelaere","MO",24,82],["Lazar Samardžić","MO",23,78],["Mateo Retegui","BU",26,83],["Gianluca Scamacca","BU",26,80]
]},
"Lazio": { c:["#87D8F7","#FFFFFF"], p:[
  ["Ivan Provedel","GB",31,81],["Christos Mandas","GB",24,76],
  ["Manuel Lazzari","DD",31,77],["Nuno Tavares","DG",25,79],["Alessio Romagnoli","DC",30,81],["Mario Gila","DC",25,79],["Patric","DC",32,76],
  ["Nicolò Rovella","MDC",23,80],["Matteo Guendouzi","MC",26,81],["Mattia Zaccagni","AG",30,81],["Gustav Isaksen","AD",24,77],
  ["Toma Bašić","MC",28,74],["Boulaye Dia","BU",28,79],["Valentín Castellanos","BU",26,78],["Pedro","AD",38,77],["Loum Tchaouna","AD",21,74]
]},
"Fiorentina": { c:["#592C82","#FFFFFF"], p:[
  ["David de Gea","GB",34,81],["Pietro Terracciano","GB",35,75],
  ["Dodô","DD",26,79],["Robin Gosens","DG",31,78],["Pietro Comuzzo","DC",20,77],["Luca Ranieri","DC",26,76],["Marin Pongračić","DC",28,77],
  ["Rolando Mandragora","MC",28,77],["Danilo Cataldi","MDC",31,76],["Yacine Adli","MO",25,77],["Edoardo Bove","MC",23,77],
  ["Albert Guðmundsson","MO",28,81],["Andrea Colpani","MO",26,77],["Jonathan Ikoné","AD",27,76],["Moise Kean","BU",25,82],["Lucas Beltrán","BU",24,77]
]},
"Bologna": { c:["#A81E22","#12284B"], p:[
  ["Łukasz Skorupski","GB",34,79],["Federico Ravaglia","GB",26,72],
  ["Emil Holm","DD",25,76],["Charalampos Lykogiannis","DG",32,75],["Sam Beukema","DC",27,79],["Jhon Lucumí","DC",27,79],["Martin Erlić","DC",27,75],["Juan Miranda","DG",25,75],
  ["Remo Freuler","MDC",33,78],["Lewis Ferguson","MC",26,80],["Nikola Moro","MC",27,74],["Giovanni Fabbian","MC",22,76],
  ["Riccardo Orsolini","AD",28,81],["Dan Ndoye","AG",24,78],["Jens Odgaard","MO",26,75],["Santiago Castro","BU",21,77],["Thijs Dallinga","BU",25,76]
]},
"Torino": { c:["#8A1E03","#FFFFFF"], p:[
  ["Vanja Milinković-Savić","GB",28,79],["Alberto Paleari","GB",33,72],
  ["Mergim Vojvoda","DD",30,75],["Cristiano Biraghi","DG",33,74],["Saúl Coco","DC",26,76],["Guillermo Maripán","DC",31,76],["Adam Masina","DC",31,73],
  ["Samuele Ricci","MDC",24,80],["Ivan Ilić","MC",24,77],["Karol Linetty","MC",30,73],["Nikola Vlašić","MO",28,78],
  ["Yann Karamoh","AG",27,74],["Che Adams","BU",29,77],["Duván Zapata","BU",34,77],["Antonio Sanabria","BU",29,75],["Cesare Casadei","MC",22,76]
]},
"Udinese": { c:["#000000","#FFFFFF"], p:[
  ["Maduka Okoye","GB",26,76],["Razvan Sava","GB",22,71],
  ["Jordan Zemura","DG",25,73],["Kingsley Ehizibue","DD",29,72],["Thomas Kristensen","DC",27,75],["Jaka Bijol","DC",26,78],["Christian Kabasele","DC",34,74],
  ["Sandi Lovrić","MC",27,77],["Jurgen Ekkelenkamp","MC",25,74],["Oier Zarraga","MC",26,73],["Florian Thauvin","AD",32,77],
  ["Lorenzo Lucca","BU",25,78],["Keinan Davis","BU",27,74],["Iker Bravo","BU",20,73],["Hassane Kamara","DG",31,75],["Alexis Sánchez","BU",36,76]
]},
"Monza": { c:["#E4022E","#FFFFFF"], p:[
  ["Stefano Turati","GB",23,74],["Alessio Cragno","GB",31,72],
  ["Pedro Pereira","DD",27,72],["Danilo D'Ambrosio","DC",36,73],["Armando Izzo","DC",33,74],["Andrea Carboni","DC",24,73],["Pablo Marí","DC",31,75],
  ["Warren Bondo","MC",21,73],["Roberto Gagliardini","MC",31,73],["Omari Forson","MC",20,72],["Georgios Kyriakopoulos","DG",28,73],
  ["Daniel Maldini","MO",23,77],["Milan Đurić","BU",35,73],["Dany Mota","BU",27,74],["Samuele Vignato","MO",21,72],["Alessandro Bianco","MC",22,72]
]},
"Genoa": { c:["#8A1E03","#12284B"], p:[
  ["Nicola Leali","GB",32,75],["Pierluigi Gollini","GB",30,73],
  ["Aarón Martín","DG",28,74],["Stefano Sabelli","DD",32,73],["Koni De Winter","DC",23,77],["Johan Vásquez","DC",27,76],["Mattia Bani","DC",31,73],
  ["Morten Frendrup","MDC",24,77],["Milan Badelj","MC",36,72],["Ruslan Malinovskyi","MO",32,78],["Patrizio Masini","MC",21,71],
  ["Junior Messias","AD",34,73],["Andrea Pinamonti","BU",26,77],["Vitinha","BU",25,73],["Caleb Ekuban","BU",31,72],["Alessandro Zanoli","DD",24,73]
]},
"Lecce": { c:["#FFE500","#E4022E"], p:[
  ["Wladimiro Falcone","GB",30,76],["Christian Früchtl","GB",25,71],
  ["Antonino Gallo","DG",25,73],["Valentín Gendrey","DD",25,73],["Federico Baschirotto","DC",29,76],["Kialonda Gaspar","DC",23,72],["Marin Pongračić","DC",28,74],
  ["Lameck Banda","AG",24,74],["Ylber Ramadani","MDC",29,74],["Balthazar Pierret","MC",24,71],["Medon Berisha","MC",22,71],
  ["Santiago Pierotti","AD",24,72],["Nikola Krstović","BU",25,77],["Ante Rebić","BU",32,73],["Rafael Rafia","MO",24,71],["Patrick Dorgu","DG",20,76]
]},
"Cagliari": { c:["#12284B","#A81E22"], p:[
  ["Elia Caprile","GB",24,76],["Simone Scuffet","GB",29,73],
  ["Gabriele Zappa","DD",26,73],["Tommaso Augello","DG",31,73],["Yerry Mina","DC",31,76],["Sebastian Palmieri","DC",23,70],["Adam Obert","DC",23,72],
  ["Nadir Zortea","DD",26,73],["Michel Adopo","MDC",25,72],["Nicolas Viola","MC",36,72],["Antoine Makoumbou","MC",27,73],
  ["Zito Luvumbo","AG",23,75],["Roberto Piccoli","BU",24,76],["Leonardo Pavoletti","BU",37,72],["Gianluca Gaetano","MO",25,75],["Nicolas Prelec","BU",24,70]
]},
"Empoli": { c:["#0067B1","#FFFFFF"], p:[
  ["Devis Vásquez","GB",27,73],["Elia Caprile","GB",24,74],
  ["Tyronne Ebuehi","DD",30,72],["Liberato Cacace","DG",25,73],["Sebastiano Luperto","DC",29,75],["Saba Goglichidze","DC",21,72],["Mattia Viti","DC",23,73],
  ["Jacopo Fazzini","MO",22,76],["Youssef Maleh","MC",27,73],["Liam Henderson","MC",29,71],["Szymon Żurkowski","MC",28,72],
  ["Emmanuel Gyasi","AG",31,72],["Pietro Pellegri","BU",24,73],["Sebastiano Esposito","BU",23,75],["Lorenzo Colombo","BU",23,74],["Ola Solbakken","AD",27,72]
]}
});

/* ---------------- BUNDESLIGA ---------------- */
Object.assign(FM.CLUBDATA, {
"Bayern Munich": { c:["#DC052D","#FFFFFF"], p:[
  ["Manuel Neuer","GB",39,86],["Sven Ulreich","GB",37,76],
  ["Konrad Laimer","DD",28,80],["Alphonso Davies","DG",25,85],["Dayot Upamecano","DC",27,84],["Kim Min-jae","DC",29,84],["Eric Dier","DC",31,80],["Josip Stanišić","DD",25,79],
  ["Joshua Kimmich","MC",30,87],["Leon Goretzka","MC",30,82],["Aleksandar Pavlović","MDC",21,80],["João Palhinha","MDC",30,82],
  ["Michael Olise","AD",23,85],["Jamal Musiala","MO",22,88],["Serge Gnabry","AG",30,82],["Leroy Sané","AG",29,84],["Harry Kane","BU",32,90],["Kingsley Coman","AG",29,83]
]},
"Leverkusen": { c:["#E32219","#000000"], p:[
  ["Lukáš Hrádecký","GB",35,81],["Matěj Kovář","GB",25,77],
  ["Jeremie Frimpong","DD",24,83],["Alejandro Grimaldo","DG",30,85],["Jonathan Tah","DC",29,83],["Edmond Tapsoba","DC",26,83],["Piero Hincapié","DC",23,82],["Nordi Mukiele","DD",27,79],
  ["Granit Xhaka","MC",33,84],["Robert Andrich","MDC",30,81],["Exequiel Palacios","MC",26,81],["Aleix García","MC",28,80],
  ["Florian Wirtz","MO",22,88],["Jonas Hofmann","AD",33,79],["Amine Adli","AG",25,79],["Victor Boniface","BU",24,82],["Patrik Schick","BU",29,82]
]},
"Dortmund": { c:["#FDE100","#000000"], p:[
  ["Gregor Kobel","GB",27,84],["Alexander Meyer","GB",34,74],
  ["Julian Ryerson","DD",27,79],["Ramy Bensebaini","DG",30,79],["Nico Schlotterbeck","DC",25,83],["Niklas Süle","DC",30,81],["Waldemar Anton","DC",29,79],["Yan Couto","DD",23,78],
  ["Emre Can","MDC",31,80],["Marcel Sabitzer","MC",31,80],["Pascal Groß","MC",34,79],["Felix Nmecha","MC",25,78],
  ["Karim Adeyemi","AG",23,81],["Julian Brandt","MO",29,82],["Jamie Gittens","AG",21,79],["Serhou Guirassy","BU",29,84],["Maximilian Beier","BU",23,79]
]},
"RB Leipzig": { c:["#DD0741","#FFFFFF"], p:[
  ["Péter Gulácsi","GB",35,80],["Maarten Vandevoordt","GB",23,77],
  ["Benjamin Henrichs","DD",28,79],["David Raum","DG",27,82],["Willi Orbán","DC",32,80],["Castello Lukeba","DC",22,81],["Lutsharel Geertruida","DC",25,80],["El Chadaille Bitshiabu","DC",20,77],
  ["Xavi Simons","MO",22,84],["Nicolas Seiwald","MDC",24,79],["Kevin Kampl","MC",34,77],["Arthur Vermeeren","MC",20,77],
  ["Antonio Nusa","AG",20,79],["Lois Openda","BU",25,83],["Benjamin Šeško","BU",22,83],["Christoph Baumgartner","MO",26,80],["Yussuf Poulsen","BU",31,77]
]},
"Stuttgart": { c:["#E32219","#FFFFFF"], p:[
  ["Alexander Nübel","GB",29,81],["Fabian Bredlow","GB",30,74],
  ["Josha Vagnoman","DD",24,76],["Maximilian Mittelstädt","DG",28,80],["Anthony Rouault","DC",24,77],["Jeff Chabot","DC",27,77],["Ameen Al-Dakhil","DC",23,76],
  ["Angelo Stiller","MDC",24,81],["Atakan Karazor","MC",28,77],["Enzo Millot","MO",23,80],["Chris Führich","AG",27,79],
  ["Jamie Leweling","AD",24,77],["Deniz Undav","BU",29,82],["Ermedin Demirović","BU",27,79],["Nick Woltemade","BU",23,78],["Fabian Rieder","MO",23,76]
]},
"Francfort": { c:["#000000","#E1000F"], p:[
  ["Kevin Trapp","GB",35,80],["Kaua Santos","GB",22,74],
  ["Rasmus Kristensen","DD",28,77],["Nathaniel Brown","DG",22,75],["Robin Koch","DC",29,80],["Arthur Theate","DC",25,78],["Tuta","DC",26,78],
  ["Ellyes Skhiri","MDC",30,78],["Mario Götze","MO",33,79],["Hugo Larsson","MC",21,79],["Farès Chaïbi","MO",22,77],
  ["Ansgar Knauff","AD",23,77],["Nnamdi Collins","DD",21,74],["Hugo Ekitiké","BU",23,81],["Omar Marmoush","BU",26,82],["Jean-Mattéo Bahoya","AG",20,75]
]},
"Wolfsburg": { c:["#65B32E","#FFFFFF"], p:[
  ["Kamil Grabara","GB",26,78],["Marius Müller","GB",32,74],
  ["Kilian Fischer","DD",25,74],["Rogério","DG",27,75],["Maxence Lacroix","DC",25,78],["Sebastiaan Bornauw","DC",26,76],["Cédric Zesiger","DC",27,74],
  ["Maximilian Arnold","MC",31,78],["Yannick Gerhardt","MC",31,75],["Mattias Svanberg","MC",26,77],["Lovro Majer","MO",27,79],
  ["Patrick Wimmer","AG",24,75],["Jonas Wind","BU",26,79],["Tiago Tomás","BU",23,75],["Mohammed Amoura","BU",25,78],["Václav Černý","AD",28,75]
]},
"Fribourg": { c:["#000000","#E1000F"], p:[
  ["Noah Atubolu","GB",23,77],["Florian Müller","GB",28,74],
  ["Lukas Kübler","DD",33,73],["Christian Günter","DG",32,77],["Matthias Ginter","DC",31,79],["Philipp Lienhart","DC",29,77],["Kiliann Sildillia","DD",23,75],
  ["Maximilian Eggestein","MC",29,77],["Nicolas Höfler","MDC",35,75],["Yannik Keitel","MC",25,73],["Vincenzo Grifo","AG",32,79],
  ["Ritsu Doan","AD",27,80],["Junior Adamu","BU",24,74],["Lucas Höler","BU",31,75],["Roland Sallai","AG",28,76],["Merlin Röhl","MC",23,74]
]},
"Hoffenheim": { c:["#1961B5","#FFFFFF"], p:[
  ["Oliver Baumann","GB",35,78],["Luca Philipp","GB",24,70],
  ["Pavel Kadeřábek","DD",33,74],["David Jurásek","DG",25,74],["Ozan Kabak","DC",25,78],["Stanley Nsoki","DC",26,75],["Kevin Akpoguma","DC",30,73],
  ["Grischa Prömel","MC",30,76],["Anton Stach","MDC",26,77],["Umut Tohumcu","MC",21,72],["Andrej Kramarić","MO",34,79],
  ["Marius Bülter","AG",32,76],["Adam Hložek","AD",23,77],["Wout Weghorst","BU",33,77],["Haris Tabaković","BU",31,74],["Maximilian Beier","BU",23,78]
]},
"Mönchengladbach": { c:["#000000","#009F4D"], p:[
  ["Moritz Nicolas","GB",27,75],["Jonas Omlin","GB",31,76],
  ["Joe Scally","DD",23,76],["Luca Netz","DG",22,74],["Ko Itakura","DC",28,79],["Nico Elvedi","DC",29,77],["Marvin Friedrich","DC",30,74],
  ["Julian Weigl","MDC",30,77],["Rocco Reitz","MC",23,75],["Florian Neuhaus","MC",28,76],["Kevin Stöger","MO",32,74],
  ["Franck Honorat","AD",29,77],["Alassane Pléa","BU",32,78],["Tim Kleindienst","BU",30,79],["Robin Hack","AG",27,75],["Nathan Ngoumou","AG",25,73]
]},
"Werder Brême": { c:["#009F4D","#FFFFFF"], p:[
  ["Michael Zetterer","GB",30,76],["Mio Backhaus","GB",21,71],
  ["Mitchell Weiser","DD",31,76],["Anthony Jung","DG",34,73],["Marco Friedl","DC",27,77],["Milos Veljković","DC",30,75],["Julián Malatini","DC",24,72],
  ["Jens Stage","MC",29,74],["Senne Lynen","MDC",26,75],["Romano Schmid","MO",25,77],["Leonardo Bittencourt","MO",32,75],
  ["Justin Njinmah","AD",24,75],["Marvin Ducksch","BU",31,78],["Derrick Köhn","DG",26,73],["Isaac Schmidt","DD",25,72],["Keke Topp","BU",21,73]
]},
"Mayence": { c:["#E1000F","#FFFFFF"], p:[
  ["Robin Zentner","GB",30,77],["Daniel Batz","GB",34,71],
  ["Phillipp Mwene","DD",31,74],["Anthony Caci","DG",28,75],["Sepp van den Berg","DC",23,77],["Andreas Hanche-Olsen","DC",28,75],["Stefan Bell","DC",33,73],
  ["Kaishu Sano","MDC",25,76],["Dominik Kohr","MC",31,74],["Nadiem Amiri","MO",28,78],["Paul Nebel","MO",22,74],
  ["Jae-sung Lee","MO",33,76],["Jonathan Burkardt","BU",25,79],["Nelson Weiper","BU",20,73],["Armindo Sieb","AG",22,73],["Danny da Costa","DD",32,72]
]},
"Augsbourg": { c:["#BA3733","#FFFFFF"], p:[
  ["Finn Dahmen","GB",27,76],["Nediljko Labrović","GB",25,72],
  ["Mads Pedersen","DG",29,75],["Kristijan Jakić","DD",28,74],["Keven Schlotterbeck","DC",28,74],["Chrislain Matsima","DC",23,74],["Cédric Zesiger","DC",27,73],
  ["Elvis Rexhbeçaj","MC",28,74],["Arne Maier","MC",26,75],["Jeffrey Gouweleeuw","DC",34,73],["Kristijan Bistrović","MC",27,72],
  ["Alexis Claude-Maurice","MO",27,76],["Ruben Vargas","AG",27,77],["Phillip Tietz","BU",28,74],["Samuel Essende","BU",27,73],["Mert Kömür","MO",20,72]
]},
"Union Berlin": { c:["#EB1923","#FFE500"], p:[
  ["Frederik Rønnow","GB",33,77],["Alexander Schwolow","GB",33,72],
  ["Christopher Trimmel","DD",38,73],["Leopold Querfeld","DC",21,74],["Diogo Leite","DC",26,77],["Danilho Doekhi","DC",27,76],["Tom Rothe","DG",21,74],
  ["Rani Khedira","MDC",31,77],["János Kesztler","MC",21,71],["Aljoscha Kemlein","MC",21,72],["Andras Schäfer","MC",26,74],
  ["Yorbe Vertessen","AG",24,74],["Benedict Hollerbach","AD",24,74],["Andrej Ilić","BU",25,74],["Ilyas Ansah","BU",21,72],["Robert Skov","DG",29,73]
]},
"Bochum": { c:["#005CA9","#FFFFFF"], p:[
  ["Timo Horn","GB",32,73],["Patrick Drewes","GB",32,71],
  ["Maximilian Wittek","DG",30,72],["Tim Oermann","DC",21,71],["Ivan Ordets","DC",33,73],["Bernardo","DC",30,72],["Felix Passlack","DD",27,72],
  ["Anthony Losilla","MDC",39,72],["Matúš Bero","MC",30,73],["Patrick Osterhage","MC",25,72],["Georgios Masouras","AG",31,72],
  ["Dani de Wit","MO",27,72],["Myron Boadu","BU",24,74],["Gerrit Holtmann","AG",30,72],["Philipp Hofmann","BU",32,72],["Moritz Broschinski","BU",24,71]
]},
"Heidenheim": { c:["#E1000F","#12284B"], p:[
  ["Kevin Müller","GB",34,73],["Diant Ramaj","GB",23,74],
  ["Jonas Föhrenbach","DG",29,71],["Marnon Busch","DD",30,71],["Patrick Mainka","DC",30,73],["Benedikt Gimber","DC",28,71],["Omar Traoré","DD",27,70],
  ["Niklas Dorsch","MDC",27,74],["Léo Scienza","MO",27,73],["Jan Schöppner","MC",26,72],["Adrian Beck","MC",28,71],
  ["Sirlord Conteh","AG",28,71],["Mathias Honsak","AD",28,72],["Tim Kleindienst","BU",30,76],["Marvin Pieringer","BU",26,71],["Budu Zivzivadze","BU",31,71]
]}
});
/*__END__*/

