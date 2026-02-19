export interface Saint {
  name: string
  date: string // MM-DD format
  bio: string // Short biography
  patronOf: string[] // What they're patron saint of
  memorial: 'solemnity' | 'feast' | 'memorial' | 'optional' // Liturgical rank
}

export const SAINTS_CALENDAR: Saint[] = [
  // January
  { name: "Mary, Mother of God", date: "01-01", bio: "The Blessed Virgin Mary, chosen by God to be the mother of Jesus Christ. Her 'yes' to God changed the course of human history.", patronOf: ["The Church", "Mothers", "All humanity"], memorial: "solemnity" },
  { name: "Basil the Great and Gregory Nazianzen", date: "01-02", bio: "Two brilliant 4th-century theologians who defended the faith against heresy and shaped Christian doctrine.", patronOf: ["Theologians", "Hospital administrators"], memorial: "memorial" },
  { name: "Elizabeth Ann Seton", date: "01-04", bio: "First native-born American saint. Founded the Sisters of Charity and established Catholic education in America.", patronOf: ["Catholic schools", "Widows", "Seafarers"], memorial: "memorial" },
  { name: "John Neumann", date: "01-05", bio: "Bohemian immigrant who became the 4th Bishop of Philadelphia. Built 80 churches and founded the first Catholic diocesan school system in America.", patronOf: ["Catholic education", "Immigrants"], memorial: "memorial" },
  { name: "André Bessette", date: "01-06", bio: "Canadian Holy Cross Brother known for his devotion to St. Joseph and miraculous healings at St. Joseph's Oratory in Montreal.", patronOf: ["The sick", "Poor people"], memorial: "optional" },
  { name: "Raymond of Penyafort", date: "01-07", bio: "Dominican friar who compiled canon law, worked for the conversion of Muslims and Jews, and defended papal authority.", patronOf: ["Canon lawyers", "Medical record librarians"], memorial: "optional" },
  { name: "Hilary of Poitiers", date: "01-13", bio: "4th-century bishop called the 'Athanasius of the West' for his defense of the Trinity against Arianism.", patronOf: ["Backward children", "Exiles"], memorial: "optional" },
  { name: "Anthony of Egypt", date: "01-17", bio: "The 'Father of Monasticism' who sold everything to live as a hermit in the Egyptian desert. His life inspired Christian monasticism.", patronOf: ["Monks", "Basket makers", "Butchers", "Gravediggers"], memorial: "memorial" },
  { name: "Fabian", date: "01-20", bio: "Pope and martyr of the 3rd century who reorganized the Church in Rome and was martyred in the Decian persecution.", patronOf: ["Potters", "Lead founders"], memorial: "optional" },
  { name: "Agnes", date: "01-21", bio: "Young Roman martyr (age 12-13) who refused marriage to remain a virgin consecrated to Christ. Martyred around 304 AD.", patronOf: ["Young girls", "Chastity", "Rape survivors"], memorial: "memorial" },
  { name: "Vincent of Saragossa", date: "01-22", bio: "Spanish deacon martyred during the Diocletian persecution. Despite torture, he remained steadfast in faith.", patronOf: ["Winegrowers", "Vinegar makers"], memorial: "optional" },
  { name: "Francis de Sales", date: "01-24", bio: "Bishop of Geneva who converted thousands of Calvinists through gentle persuasion. Wrote 'Introduction to the Devout Life.'", patronOf: ["Writers", "Journalists", "Deaf people", "Teachers"], memorial: "memorial" },
  { name: "Conversion of St. Paul", date: "01-25", bio: "Celebration of Paul's dramatic conversion from persecutor of Christians to the greatest missionary of the early Church.", patronOf: ["Missionaries", "Evangelists", "Theologians"], memorial: "feast" },
  { name: "Timothy and Titus", date: "01-26", bio: "Paul's beloved companions and bishops. Timothy led the church in Ephesus, Titus in Crete.", patronOf: ["Stomach disorders (Timothy)", "Crete (Titus)"], memorial: "memorial" },
  { name: "Angela Merici", date: "01-27", bio: "Founded the Ursulines, the first teaching order of women in the Catholic Church, dedicated to educating young girls.", patronOf: ["Teachers", "University students", "The sick"], memorial: "optional" },
  { name: "Thomas Aquinas", date: "01-28", bio: "Dominican friar and theologian, the 'Angelic Doctor.' Wrote the Summa Theologica, synthesizing faith and reason.", patronOf: ["Students", "Schools", "Theologians", "Philosophers"], memorial: "memorial" },
  
  // February
  { name: "Presentation of the Lord", date: "02-02", bio: "Celebration of Mary and Joseph presenting the infant Jesus in the Temple, where Simeon recognized Him as the Messiah.", patronOf: ["Candlemakers"], memorial: "feast" },
  { name: "Blaise", date: "02-03", bio: "Armenian bishop and martyr known for miraculously healing a boy choking on a fish bone. Tradition of blessing throats on his feast day.", patronOf: ["Throat ailments", "Animals", "Wool combers"], memorial: "optional" },
  { name: "Agatha", date: "02-05", bio: "Sicilian virgin martyr who refused the advances of a Roman prefect. Her breasts were cut off but miraculously healed.", patronOf: ["Breast cancer patients", "Nurses", "Bell founders"], memorial: "memorial" },
  { name: "Paul Miki and Companions", date: "02-06", bio: "26 martyrs crucified in Nagasaki, Japan in 1597 - priests, brothers, and laypeople who refused to renounce their faith.", patronOf: ["Japan"], memorial: "memorial" },
  { name: "Jerome Emiliani", date: "02-08", bio: "Venetian soldier turned priest who dedicated his life to orphans, founding hospitals and the Somaschi order.", patronOf: ["Orphans", "Abandoned children"], memorial: "optional" },
  { name: "Josephine Bakhita", date: "02-08", bio: "Sudanese woman kidnapped into slavery at age 7, later freed and became a Canossian sister in Italy. Symbol of hope against human trafficking.", patronOf: ["Sudan", "Human trafficking survivors"], memorial: "optional" },
  { name: "Scholastica", date: "02-10", bio: "Twin sister of St. Benedict and founder of Benedictine nuns. Known for her powerful prayer that kept Benedict visiting longer.", patronOf: ["Nuns", "Convulsive children", "Rain"], memorial: "memorial" },
  { name: "Our Lady of Lourdes", date: "02-11", bio: "Commemoration of Mary's 18 appearances to Bernadette Soubirous in 1858, revealing a healing spring at Lourdes.", patronOf: ["The sick", "Body ailments"], memorial: "optional" },
  { name: "Cyril and Methodius", date: "02-14", bio: "Brothers who evangelized the Slavic peoples, created the Cyrillic alphabet, and are co-patron saints of Europe.", patronOf: ["Europe", "Ecumenism"], memorial: "memorial" },
  { name: "Seven Holy Founders of the Servite Order", date: "02-17", bio: "Seven Florentine merchants who gave up wealth to found the Order of Servants of Mary, dedicated to her sorrows.", patronOf: ["Servite Order"], memorial: "optional" },
  { name: "Simeon of Jerusalem", date: "02-18", bio: "Cousin of Jesus who became the second Bishop of Jerusalem after St. James. Martyred by crucifixion at age 120.", patronOf: ["Jerusalem"], memorial: "optional" },
  { name: "Chair of St. Peter", date: "02-22", bio: "Celebration of Peter's authority as the first Pope and the Church's foundation on the Apostles.", patronOf: ["Papal authority"], memorial: "feast" },
  { name: "Polycarp", date: "02-23", bio: "Bishop of Smyrna and disciple of John the Apostle. Martyred at age 86, burned at the stake for refusing to deny Christ.", patronOf: ["Dysentery", "Earache sufferers"], memorial: "memorial" },

  // March
  { name: "Katharine Drexel", date: "03-03", bio: "American heiress who gave her fortune to found schools and missions for Native Americans and African Americans. Founded the Sisters of the Blessed Sacrament.", patronOf: ["Racial justice", "Philanthropists"], memorial: "optional" },
  { name: "Casimir", date: "03-04", bio: "Polish prince who refused the throne to dedicate his life to prayer and care for the poor. Died at age 25.", patronOf: ["Poland", "Lithuania", "Young people"], memorial: "optional" },
  { name: "Perpetua and Felicity", date: "03-07", bio: "Young noblewoman and her slave, martyred together in Carthage (203 AD). Their diary of imprisonment is one of Christianity's earliest documents.", patronOf: ["Mothers", "Expectant mothers", "Cattle"], memorial: "memorial" },
  { name: "John of God", date: "03-08", bio: "Portuguese soldier turned hermit who founded a hospital for the poor and sick. Pioneer of modern healthcare.", patronOf: ["Hospitals", "Nurses", "The sick", "Heart patients"], memorial: "optional" },
  { name: "Frances of Rome", date: "03-09", bio: "Roman noblewoman who nursed the sick during plague while raising a family. Founded the Oblates of Mary.", patronOf: ["Motorists", "Widows"], memorial: "optional" },
  { name: "Patrick", date: "03-17", bio: "British slave taken to Ireland who escaped, became a priest, and returned to convert Ireland to Christianity.", patronOf: ["Ireland", "Engineers", "Against snakes"], memorial: "optional" },
  { name: "Cyril of Jerusalem", date: "03-18", bio: "4th-century bishop whose catechetical lectures are treasures of early Church teaching on the sacraments.", patronOf: ["Catechists"], memorial: "optional" },
  { name: "Joseph, Spouse of the Blessed Virgin Mary", date: "03-19", bio: "Husband of Mary and foster father of Jesus. The silent saint whose humble obedience protected the Holy Family.", patronOf: ["Workers", "Fathers", "Carpenters", "The dying", "The Universal Church"], memorial: "solemnity" },
  { name: "Turibius of Mogrovejo", date: "03-23", bio: "Spanish missionary and archbishop who walked throughout Peru evangelizing, confirming half a million people.", patronOf: ["Latin American bishops"], memorial: "optional" },
  { name: "The Annunciation", date: "03-25", bio: "Celebration of the angel Gabriel announcing to Mary that she would bear the Son of God.", patronOf: ["Pregnancy"], memorial: "solemnity" },

  // April
  { name: "Francis of Paola", date: "04-02", bio: "Italian hermit and founder of the Minim Friars who lived on vegetables and water. Known for miraculous healings.", patronOf: ["Naval officers", "Sailors"], memorial: "optional" },
  { name: "Isidore of Seville", date: "04-04", bio: "7th-century bishop whose encyclopedia preserved classical learning for medieval Europe. Doctor of the Church.", patronOf: ["Internet", "Computer users", "Students"], memorial: "optional" },
  { name: "Vincent Ferrer", date: "04-05", bio: "Spanish Dominican missionary who preached across Europe for 20 years, converting thousands including many Jews.", patronOf: ["Construction workers", "Plumbers"], memorial: "optional" },
  { name: "John Baptist de la Salle", date: "04-07", bio: "Founded the Christian Brothers to educate poor boys. Pioneer of teacher training and classroom instruction in the vernacular.", patronOf: ["Teachers", "School principals"], memorial: "memorial" },
  { name: "Anselm", date: "04-21", bio: "Benedictine monk, Archbishop of Canterbury, and theologian. His 'ontological argument' for God's existence influenced philosophy.", patronOf: ["Theologians"], memorial: "optional" },
  { name: "George", date: "04-23", bio: "Roman soldier martyred for refusing to renounce Christianity. Legend of slaying the dragon symbolizes triumph over evil.", patronOf: ["England", "Soldiers", "Scouts"], memorial: "optional" },
  { name: "Mark", date: "04-25", bio: "Evangelist and author of the second Gospel. Companion of Peter and Paul, founder of the Church in Alexandria.", patronOf: ["Lawyers", "Egypt", "Venice"], memorial: "feast" },
  { name: "Catherine of Siena", date: "04-29", bio: "Mystic and Doctor of the Church who convinced the Pope to return from Avignon to Rome. Author of 'The Dialogue.'", patronOf: ["Europe", "Nurses", "Fire prevention"], memorial: "memorial" },
  { name: "Pius V", date: "04-30", bio: "Dominican pope who implemented reforms of the Council of Trent and standardized the Mass.", patronOf: ["Valletta, Malta"], memorial: "optional" },

  // May
  { name: "Joseph the Worker", date: "05-01", bio: "Celebration of St. Joseph as model of dignity of labor and Christian workers everywhere.", patronOf: ["Workers", "Labor movement"], memorial: "optional" },
  { name: "Athanasius", date: "05-02", bio: "Bishop of Alexandria who defended the divinity of Christ against Arianism. Exiled five times for his faith.", patronOf: ["Theologians"], memorial: "memorial" },
  { name: "Philip and James", date: "05-03", bio: "Two apostles: Philip who brought Nathanael to Jesus, and James 'the Less' who led the Jerusalem church.", patronOf: ["Uruguay (Philip)", "Pharmacists (James)"], memorial: "feast" },
  { name: "Matthias", date: "05-14", bio: "Chosen to replace Judas as one of the Twelve Apostles after Jesus' Ascension.", patronOf: ["Alcoholics", "Carpenters", "Tailors"], memorial: "feast" },
  { name: "John I", date: "05-18", bio: "Pope martyred by Arian king Theodoric after advocating for religious tolerance.", patronOf: ["Against epilepsy"], memorial: "optional" },
  { name: "Bernardine of Siena", date: "05-20", bio: "Franciscan preacher famous for promoting devotion to the Holy Name of Jesus through the IHS symbol.", patronOf: ["Advertisers", "Public relations", "Compulsive gambling"], memorial: "optional" },
  { name: "Christopher Magallanes and Companions", date: "05-21", bio: "25 Mexican martyrs killed during religious persecution (1915-1937). Includes priests and laypeople.", patronOf: ["Mexico"], memorial: "optional" },
  { name: "Rita of Cascia", date: "05-22", bio: "Wife, mother, widow, nun. Known for enduring an abusive marriage and bearing the stigmata. Patron of impossible causes.", patronOf: ["Impossible causes", "Abused women", "Loneliness"], memorial: "optional" },
  { name: "Bede the Venerable", date: "05-25", bio: "English monk whose 'Ecclesiastical History of the English People' earned him the title 'Father of English History.'", patronOf: ["Scholars", "Historians"], memorial: "optional" },
  { name: "Philip Neri", date: "05-26", bio: "Joyful priest in Counter-Reformation Rome who founded the Oratory. Known for his humor and love of the poor.", patronOf: ["Rome", "US Special Forces"], memorial: "memorial" },
  { name: "Augustine of Canterbury", date: "05-27", bio: "Benedictine monk sent by Pope Gregory the Great to evangelize England. First Archbishop of Canterbury.", patronOf: ["England"], memorial: "optional" },
  { name: "Visitation of the Blessed Virgin Mary", date: "05-31", bio: "Mary's visit to her cousin Elizabeth, when Elizabeth's unborn child (John the Baptist) leaped for joy.", patronOf: ["Pregnant women"], memorial: "feast" },

  // June
  { name: "Justin Martyr", date: "06-01", bio: "Philosopher who converted to Christianity and wrote defenses of the faith. Beheaded in Rome around 165 AD.", patronOf: ["Philosophers", "Apologists"], memorial: "memorial" },
  { name: "Marcellinus and Peter", date: "06-02", bio: "Priest and exorcist martyred together in Rome during Diocletian persecution (304 AD).", patronOf: ["Against fever"], memorial: "optional" },
  { name: "Charles Lwanga and Companions", date: "06-03", bio: "22 Ugandan martyrs, ages 13-30, burned alive for refusing the king's sexual advances and for their faith (1886).", patronOf: ["African youth", "Catholic Action"], memorial: "memorial" },
  { name: "Boniface", date: "06-05", bio: "English missionary who evangelized Germany and crowned Charlemagne. Martyred while reading the Gospel to converts.", patronOf: ["Germany", "Brewers"], memorial: "memorial" },
  { name: "Norbert", date: "06-06", bio: "German bishop who founded the Premonstratensian Order (Norbertines) after a near-death experience converted him.", patronOf: ["Peace", "Safe childbirth"], memorial: "optional" },
  { name: "Ephrem", date: "06-09", bio: "Syrian deacon, poet, and theologian whose hymns taught theology to illiterate Christians. Doctor of the Church.", patronOf: ["Spiritual directors"], memorial: "optional" },
  { name: "Barnabas", date: "06-11", bio: "Apostle who introduced Paul to the disciples and traveled with him on missionary journeys. The 'Son of Encouragement.'", patronOf: ["Cyprus", "Against hailstorms"], memorial: "memorial" },
  { name: "Anthony of Padua", date: "06-13", bio: "Franciscan priest and brilliant preacher known for miracles, finding lost items, and defending the Eucharist.", patronOf: ["Lost items", "The poor", "Portugal"], memorial: "memorial" },
  { name: "Romuald", date: "06-19", bio: "Benedictine hermit who founded the Camaldolese Order, combining monastic and hermit life.", patronOf: ["Camaldolese Order"], memorial: "optional" },
  { name: "Aloysius Gonzaga", date: "06-21", bio: "Italian Jesuit who gave up nobility to serve plague victims. Died at 23 caring for the sick.", patronOf: ["Young people", "Students", "AIDS patients"], memorial: "memorial" },
  { name: "Thomas More and John Fisher", date: "06-22", bio: "English martyrs beheaded by Henry VIII for refusing to accept him as head of the Church.", patronOf: ["Lawyers (More)", "Diocese clergy (Fisher)"], memorial: "optional" },
  { name: "Birth of John the Baptist", date: "06-24", bio: "The precursor who prepared the way for Jesus and baptized Him in the Jordan River.", patronOf: ["Baptism", "Conversion"], memorial: "solemnity" },
  { name: "Cyril of Alexandria", date: "06-27", bio: "5th-century bishop and Doctor who defended the title 'Theotokos' (Mother of God) for Mary at the Council of Ephesus.", patronOf: ["Against blindness"], memorial: "optional" },
  { name: "Irenaeus", date: "06-28", bio: "Bishop of Lyons whose writings against heresies preserved early Church teaching. Martyr.", patronOf: ["Catechists"], memorial: "memorial" },
  { name: "Peter and Paul", date: "06-29", bio: "The two pillars of the Church: Peter the rock, Paul the missionary. Both martyred in Rome.", patronOf: ["Rome", "Popes (Peter)", "Missionaries (Paul)"], memorial: "solemnity" },

  // July
  { name: "Junipero Serra", date: "07-01", bio: "Franciscan missionary who founded 9 missions in California, bringing Christianity to Native Americans.", patronOf: ["Vocations"], memorial: "optional" },
  { name: "Thomas", date: "07-03", bio: "Apostle who doubted Jesus' resurrection until seeing His wounds. Tradition says he evangelized India.", patronOf: ["India", "Architects", "Doubters"], memorial: "feast" },
  { name: "Elizabeth of Portugal", date: "07-04", bio: "Queen who devoted herself to peace and the poor after her husband's death. Known as 'the Peacemaker.'", patronOf: ["Difficult marriages", "Brides"], memorial: "optional" },
  { name: "Anthony Zaccaria", date: "07-05", bio: "Founded the Barnabites to renew Christian life through the Eucharist and Paul's letters.", patronOf: ["Physicians"], memorial: "optional" },
  { name: "Maria Goretti", date: "07-06", bio: "Italian girl martyred at age 11 for resisting rape. Forgave her attacker before dying.", patronOf: ["Rape victims", "Youth", "Purity"], memorial: "optional" },
  { name: "Augustine Zhao Rong and Companions", date: "07-09", bio: "120 Chinese martyrs killed between 1648-1930 during various persecutions.", patronOf: ["China"], memorial: "optional" },
  { name: "Benedict", date: "07-11", bio: "Father of Western Monasticism. His Rule has guided monastic life for 1,500 years. Co-patron of Europe.", patronOf: ["Europe", "Monks", "Students", "Engineers"], memorial: "memorial" },
  { name: "Henry", date: "07-13", bio: "Holy Roman Emperor who worked with his wife to build churches and support monasteries.", patronOf: ["Dukes"], memorial: "optional" },
  { name: "Kateri Tekakwitha", date: "07-14", bio: "First Native American saint. Mohawk woman who converted despite persecution from her tribe. Lived in radical purity.", patronOf: ["Ecology", "Native Americans", "People ridiculed for piety"], memorial: "memorial" },
  { name: "Bonaventure", date: "07-15", bio: "Franciscan theologian and Doctor of the Church. Minister General who wrote a biography of St. Francis.", patronOf: ["Bowel disorders"], memorial: "memorial" },
  { name: "Our Lady of Mount Carmel", date: "07-16", bio: "Commemoration of Mary's appearance to Simon Stock, giving the Brown Scapular as sign of her protection.", patronOf: ["Carmelites"], memorial: "optional" },
  { name: "Camillus de Lellis", date: "07-18", bio: "Soldier turned nurse who founded the Ministers of the Sick. Pioneer of modern hospital care.", patronOf: ["Nurses", "Hospitals", "The sick"], memorial: "optional" },
  { name: "Apollinaris", date: "07-20", bio: "First bishop of Ravenna, martyred for his faith in the 1st century.", patronOf: ["Ravenna", "Against epilepsy"], memorial: "optional" },
  { name: "Lawrence of Brindisi", date: "07-21", bio: "Capuchin friar, linguist, and Doctor who preached against the Reformation and led troops against the Turks.", patronOf: ["Brindisi"], memorial: "optional" },
  { name: "Mary Magdalene", date: "07-22", bio: "First witness to the Resurrection. The 'Apostle to the Apostles' who announced Christ's rising.", patronOf: ["Converts", "Penitent sinners", "Pharmacists"], memorial: "memorial" },
  { name: "Bridget of Sweden", date: "07-23", bio: "Mystic, mother of 8, and founder of the Bridgettines. Her revelations influenced medieval spirituality.", patronOf: ["Sweden", "Widows"], memorial: "optional" },
  { name: "Sharbel Makhluf", date: "07-24", bio: "Lebanese Maronite hermit known for miracles. Lived 23 years in solitude, praying constantly.", patronOf: ["Lebanon"], memorial: "optional" },
  { name: "James", date: "07-25", bio: "Son of Zebedee, brother of John. First apostle martyred (44 AD). His shrine in Spain is a major pilgrimage site.", patronOf: ["Spain", "Pilgrims", "Soldiers"], memorial: "feast" },
  { name: "Joachim and Anne", date: "07-26", bio: "Parents of the Blessed Virgin Mary and grandparents of Jesus. Not mentioned in Scripture but honored by tradition.", patronOf: ["Grandparents", "Mothers (Anne)"], memorial: "memorial" },
  { name: "Martha", date: "07-29", bio: "Sister of Mary and Lazarus who served Jesus in her home. Patron of active service.", patronOf: ["Cooks", "Servers", "Housewives"], memorial: "memorial" },
  { name: "Peter Chrysologus", date: "07-30", bio: "Archbishop of Ravenna known for his golden-tongued preaching. Doctor of the Church.", patronOf: ["Against fever"], memorial: "optional" },
  { name: "Ignatius of Loyola", date: "07-31", bio: "Spanish soldier whose battle wound led to conversion. Founded the Society of Jesus (Jesuits).", patronOf: ["Soldiers", "Jesuits", "Retreats"], memorial: "memorial" },

  // August
  { name: "Alphonsus Liguori", date: "08-01", bio: "Italian bishop who founded the Redemptorists. His moral theology balanced law and mercy. Doctor of the Church.", patronOf: ["Confessors", "Moral theologians"], memorial: "memorial" },
  { name: "Eusebius of Vercelli", date: "08-02", bio: "Bishop who defended the divinity of Christ against Arianism. Exiled for his faith.", patronOf: ["Against stomachache"], memorial: "optional" },
  { name: "John Vianney", date: "08-04", bio: "The Curé of Ars who spent 16 hours daily in the confessional. Patron of all priests.", patronOf: ["Priests", "Confessors"], memorial: "memorial" },
  { name: "Dedication of St. Mary Major", date: "08-05", bio: "Commemoration of one of Rome's four major basilicas, built after Our Lady appeared asking for it.", patronOf: ["Snow in August"], memorial: "optional" },
  { name: "Transfiguration of the Lord", date: "08-06", bio: "Jesus revealed His divine glory to Peter, James, and John on Mount Tabor.", patronOf: ["Against temptation"], memorial: "feast" },
  { name: "Sixtus II and Companions", date: "08-07", bio: "Pope martyred with four deacons during the Valerian persecution (258 AD).", patronOf: ["Against fever"], memorial: "optional" },
  { name: "Dominic", date: "08-08", bio: "Spanish priest who founded the Order of Preachers (Dominicans) to combat heresy through teaching.", patronOf: ["Astronomers", "Dominicans", "Scientists"], memorial: "memorial" },
  { name: "Teresa Benedicta of the Cross (Edith Stein)", date: "08-09", bio: "Jewish philosopher who converted, became a Carmelite nun, and died at Auschwitz. Co-patron of Europe.", patronOf: ["Europe", "Loss of parents", "Martyrs"], memorial: "optional" },
  { name: "Lawrence", date: "08-10", bio: "Deacon martyred on a gridiron in Rome (258 AD). Joked with his torturers: 'Turn me over, I'm done on this side!'", patronOf: ["Cooks", "The poor", "Librarians"], memorial: "feast" },
  { name: "Clare", date: "08-11", bio: "Follower of Francis who founded the Poor Clares. Lived in radical poverty and contemplation.", patronOf: ["Television", "Eye disease", "Good weather"], memorial: "memorial" },
  { name: "Jane Frances de Chantal", date: "08-12", bio: "Widow who co-founded the Visitation Order with Francis de Sales after raising her children.", patronOf: ["Widows", "Parents separated from children"], memorial: "optional" },
  { name: "Pontian and Hippolytus", date: "08-13", bio: "Pope and priest who reconciled before being martyred together in Sardinian mines (235 AD).", patronOf: ["Against demonic possession"], memorial: "optional" },
  { name: "Maximilian Kolbe", date: "08-14", bio: "Franciscan friar who volunteered to die in place of a stranger at Auschwitz. Martyr of charity.", patronOf: ["Journalists", "Families", "Drug addiction"], memorial: "memorial" },
  { name: "Assumption of the Blessed Virgin Mary", date: "08-15", bio: "Mary taken body and soul into heaven at the end of her earthly life.", patronOf: ["All humanity"], memorial: "solemnity" },
  { name: "Stephen of Hungary", date: "08-16", bio: "First king of Hungary who Christianized the nation and united it under Christian rule.", patronOf: ["Hungary", "Kings"], memorial: "optional" },
  { name: "John Eudes", date: "08-19", bio: "French priest who promoted devotion to the Sacred Hearts of Jesus and Mary. Founded two religious orders.", patronOf: ["Against storms"], memorial: "optional" },
  { name: "Bernard", date: "08-20", bio: "Doctor of the Church who reformed Benedictine life, founded Clairvaux Abbey, and promoted the Second Crusade.", patronOf: ["Beekeepers", "Candlemakers"], memorial: "memorial" },
  { name: "Pius X", date: "08-21", bio: "Pope who lowered the age for First Communion, promoted frequent Communion, and reformed Church music.", patronOf: ["First Communicants"], memorial: "memorial" },
  { name: "Queenship of the Blessed Virgin Mary", date: "08-22", bio: "Mary crowned as Queen of Heaven and Earth, Mother of the King of Kings.", patronOf: ["Royalty"], memorial: "memorial" },
  { name: "Rose of Lima", date: "08-23", bio: "First saint of the Americas. Peruvian Dominican tertiary who lived in extreme penance while caring for the poor.", patronOf: ["Latin America", "Gardeners", "Florists"], memorial: "memorial" },
  { name: "Bartholomew", date: "08-24", bio: "Apostle identified with Nathanael. Tradition says he was flayed alive in Armenia.", patronOf: ["Tanners", "Armenia", "Against nervous diseases"], memorial: "feast" },
  { name: "Louis", date: "08-25", bio: "King of France who led two crusades, built hospitals, and ransomed Christian slaves. Model of Christian kingship.", patronOf: ["France", "Kings", "Hairdressers"], memorial: "optional" },
  { name: "Joseph Calasanz", date: "08-25", bio: "Spanish priest who founded the first free public school in Europe for poor children.", patronOf: ["Students", "Schools"], memorial: "optional" },
  { name: "Monica", date: "08-27", bio: "Mother of Augustine whose prayers and tears for 17 years led to her son's conversion.", patronOf: ["Mothers", "Alcoholism", "Difficult marriages"], memorial: "memorial" },
  { name: "Augustine", date: "08-28", bio: "Converted sinner who became Bishop of Hippo and Doctor of the Church. Wrote 'Confessions' and 'City of God.'", patronOf: ["Theologians", "Brewers", "Printers"], memorial: "memorial" },
  { name: "Passion of John the Baptist", date: "08-29", bio: "Commemoration of John's beheading by Herod at the request of Herodias' daughter.", patronOf: ["Beheading victims"], memorial: "memorial" },

  // September
  { name: "Gregory the Great", date: "09-03", bio: "Pope and Doctor who reformed the liturgy, evangelized England, and left writings on pastoral care.", patronOf: ["Teachers", "Musicians", "Popes"], memorial: "memorial" },
  { name: "Birth of the Blessed Virgin Mary", date: "09-08", bio: "Celebration of Mary's birth, preparing the way for the Incarnation of Christ.", patronOf: ["Mothers"], memorial: "feast" },
  { name: "Peter Claver", date: "09-09", bio: "Spanish Jesuit who ministered to 300,000 African slaves in Colombia, calling himself 'slave of the slaves.'", patronOf: ["African Americans", "Colombia", "Slaves"], memorial: "optional" },
  { name: "Exaltation of the Holy Cross", date: "09-14", bio: "Celebration of the cross as instrument of our salvation, first commemorated after its rediscovery in 326 AD.", patronOf: ["Against fever"], memorial: "feast" },
  { name: "Our Lady of Sorrows", date: "09-15", bio: "Mary's compassion as she witnessed Jesus' passion and death. The sword that pierced her heart.", patronOf: ["Bereaved mothers"], memorial: "memorial" },
  { name: "Cornelius and Cyprian", date: "09-16", bio: "Pope and Bishop of Carthage who fought for reconciliation of lapsed Christians. Both martyred in 258 AD.", patronOf: ["Against epilepsy (Cornelius)", "North Africa (Cyprian)"], memorial: "memorial" },
  { name: "Robert Bellarmine", date: "09-17", bio: "Jesuit cardinal and Doctor who defended the Catholic faith against Protestantism with scholarship and charity.", patronOf: ["Catechists", "Catechumens"], memorial: "optional" },
  { name: "Januarius", date: "09-19", bio: "Bishop of Benevento martyred under Diocletian. His blood, kept in Naples, miraculously liquefies regularly.", patronOf: ["Naples", "Against volcanic eruptions"], memorial: "optional" },
  { name: "Andrew Kim Taegon, Paul Chong Hasang, and Companions", date: "09-20", bio: "103 Korean martyrs killed between 1839-1867. First Korean priest was among them.", patronOf: ["Korea"], memorial: "memorial" },
  { name: "Matthew", date: "09-21", bio: "Tax collector called by Jesus to be an apostle. Author of the first Gospel.", patronOf: ["Bankers", "Tax collectors", "Accountants"], memorial: "feast" },
  { name: "Padre Pio", date: "09-23", bio: "Capuchin priest who bore the stigmata for 50 years. Known for healing, bilocation, and spiritual direction.", patronOf: ["Civil defense volunteers", "Stress relief"], memorial: "memorial" },
  { name: "Cosmas and Damian", date: "09-26", bio: "Twin brothers and physicians who practiced medicine for free and were martyred under Diocletian.", patronOf: ["Physicians", "Surgeons", "Pharmacists"], memorial: "optional" },
  { name: "Vincent de Paul", date: "09-27", bio: "French priest who organized charity on a vast scale, founding the Vincentians and Daughters of Charity.", patronOf: ["Charities", "Volunteers", "Lost articles"], memorial: "memorial" },
  { name: "Wenceslaus", date: "09-28", bio: "Duke of Bohemia martyred by his brother for his Christian policies. Good King Wenceslaus of the carol.", patronOf: ["Czech Republic", "Brewers"], memorial: "optional" },
  { name: "Michael, Gabriel, and Raphael", date: "09-29", bio: "The three archangels named in Scripture: Michael the warrior, Gabriel the messenger, Raphael the healer.", patronOf: ["Police (Michael)", "Messengers (Gabriel)", "Travelers (Raphael)"], memorial: "feast" },
  { name: "Jerome", date: "09-30", bio: "Doctor who translated the Bible into Latin (Vulgate) and wrote biblical commentaries. Known for his temper.", patronOf: ["Librarians", "Students", "Translators"], memorial: "memorial" },

  // October
  { name: "Thérèse of the Child Jesus", date: "10-01", bio: "French Carmelite nun who died at 24. Her 'little way' of spiritual childhood influenced millions. Doctor of the Church.", patronOf: ["Missions", "Florists", "AIDS patients"], memorial: "memorial" },
  { name: "Guardian Angels", date: "10-02", bio: "Celebration of the angels God assigns to watch over and guide each person.", patronOf: ["Protection"], memorial: "memorial" },
  { name: "Francis of Assisi", date: "10-04", bio: "Founder of the Franciscans who embraced radical poverty, preached to animals, and received the stigmata.", patronOf: ["Animals", "Ecology", "Italy", "Merchants"], memorial: "memorial" },
  { name: "Faustina Kowalska", date: "10-05", bio: "Polish nun to whom Jesus revealed the Divine Mercy devotion. 'Jesus, I trust in You.'", patronOf: ["Mercy", "World Youth Day"], memorial: "optional" },
  { name: "Bruno", date: "10-06", bio: "Founded the Carthusian Order, combining hermit and monastic life in strict solitude and silence.", patronOf: ["Against demonic possession"], memorial: "optional" },
  { name: "Our Lady of the Rosary", date: "10-07", bio: "Commemoration of Mary's intercession through the Rosary, especially the victory at Lepanto (1571).", patronOf: ["Victory in battle"], memorial: "memorial" },
  { name: "Denis and Companions", date: "10-09", bio: "First Bishop of Paris, martyred around 250 AD. Legend says he carried his own head after beheading.", patronOf: ["France", "Against headaches"], memorial: "optional" },
  { name: "John XXIII", date: "10-11", bio: "The 'Good Pope' who called Vatican II, opened the Church to the modern world, and promoted unity.", patronOf: ["Papal delegates"], memorial: "optional" },
  { name: "Callistus I", date: "10-14", bio: "Former slave who became pope. Organized the catacombs and showed mercy to repentant sinners. Martyred.", patronOf: ["Cemetery workers"], memorial: "optional" },
  { name: "Teresa of Ávila", date: "10-15", bio: "Carmelite reformer, mystic, and Doctor who wrote 'The Interior Castle' on prayer and spiritual life.", patronOf: ["Spain", "Headaches", "Lacemakers"], memorial: "memorial" },
  { name: "Hedwig", date: "10-16", bio: "Duchess of Silesia who founded hospitals and monasteries. Became a Franciscan nun after her husband's death.", patronOf: ["Silesia", "Widows"], memorial: "optional" },
  { name: "Margaret Mary Alacoque", date: "10-16", bio: "French nun to whom Jesus revealed His Sacred Heart, asking for reparation and First Friday devotion.", patronOf: ["Against polio"], memorial: "optional" },
  { name: "Ignatius of Antioch", date: "10-17", bio: "Bishop thrown to lions in Rome's Colosseum. His letters to churches are treasures of early Christianity.", patronOf: ["Church in Eastern Mediterranean"], memorial: "memorial" },
  { name: "Luke", date: "10-18", bio: "Physician, companion of Paul, and author of the third Gospel and Acts of the Apostles.", patronOf: ["Physicians", "Artists", "Surgeons"], memorial: "feast" },
  { name: "John de Brébeuf, Isaac Jogues, and Companions", date: "10-19", bio: "Eight Jesuit martyrs tortured and killed by Iroquois in New France (1642-1649).", patronOf: ["Canada"], memorial: "memorial" },
  { name: "Paul of the Cross", date: "10-20", bio: "Founded the Passionists to promote devotion to Christ's Passion through preaching and retreats.", patronOf: ["Against fever"], memorial: "optional" },
  { name: "John Paul II", date: "10-22", bio: "Polish pope who survived assassination, helped end communism, and called for a 'new evangelization.'", patronOf: ["World Youth Day", "Families"], memorial: "optional" },
  { name: "James of Jerusalem", date: "10-23", bio: "'Brother of the Lord' who led the Jerusalem church and wrote the Letter of James. Thrown from Temple.", patronOf: ["Apothecaries", "Arthritis sufferers"], memorial: "feast" },
  { name: "Anthony Mary Claret", date: "10-24", bio: "Spanish bishop and founder of the Claretians who published 144 books and evangelized Cuba and Spain.", patronOf: ["Catholic press", "Weavers"], memorial: "optional" },
  { name: "Simon and Jude", date: "10-28", bio: "Two apostles: Simon the Zealot and Jude (author of the epistle), both martyred in Persia.", patronOf: ["Desperate situations (Jude)"], memorial: "feast" },

  // November
  { name: "All Saints", date: "11-01", bio: "Celebration of all the holy men and women, known and unknown, who are in heaven with God.", patronOf: ["All the faithful"], memorial: "solemnity" },
  { name: "All Souls' Day", date: "11-02", bio: "Day of prayer for all the faithful departed who are being purified in purgatory.", patronOf: ["The dead"], memorial: "feast" },
  { name: "Martin de Porres", date: "11-03", bio: "Peruvian Dominican brother of mixed race who cared for the poor and sick. First Black saint of the Americas.", patronOf: ["Mixed-race people", "Barbers", "Public health"], memorial: "optional" },
  { name: "Charles Borromeo", date: "11-04", bio: "Archbishop of Milan who implemented Council of Trent reforms and cared for plague victims.", patronOf: ["Apple orchards", "Bishops"], memorial: "memorial" },
  { name: "Dedication of the Lateran Basilica", date: "11-09", bio: "The cathedral of Rome, 'mother church' of Catholicism, dedicated in 324 AD.", patronOf: ["Rome"], memorial: "feast" },
  { name: "Leo the Great", date: "11-10", bio: "Pope and Doctor who convinced Attila the Hun not to sack Rome and defended Christ's two natures.", patronOf: ["Against the flu"], memorial: "memorial" },
  { name: "Martin of Tours", date: "11-11", bio: "Roman soldier who cut his cloak to share with a beggar (who was Christ). Became Bishop of Tours.", patronOf: ["Soldiers", "Beggars", "France"], memorial: "memorial" },
  { name: "Josaphat", date: "11-12", bio: "Ukrainian bishop martyred for working toward unity between Eastern and Western Churches.", patronOf: ["Ukraine"], memorial: "memorial" },
  { name: "Frances Xavier Cabrini", date: "11-13", bio: "Italian immigrant to America who founded schools and hospitals for Italian immigrants. First US citizen saint.", patronOf: ["Immigrants", "Hospital administrators"], memorial: "optional" },
  { name: "Albert the Great", date: "11-15", bio: "Dominican friar, scientist, and philosopher. Teacher of Thomas Aquinas. Doctor of the Church.", patronOf: ["Scientists", "Philosophers", "Students"], memorial: "optional" },
  { name: "Margaret of Scotland", date: "11-16", bio: "Queen who reformed the Scottish Church and was known for her care of the poor. Mother of 8 children.", patronOf: ["Scotland", "Large families"], memorial: "optional" },
  { name: "Gertrude the Great", date: "11-16", bio: "German Benedictine nun and mystic known for visions of the Sacred Heart and deep theological insights.", patronOf: ["West Indies"], memorial: "optional" },
  { name: "Elizabeth of Hungary", date: "11-17", bio: "Princess who gave her wealth to the poor and built hospitals. Widowed at 20, died at 24.", patronOf: ["Bakers", "Beggars", "Homeless"], memorial: "memorial" },
  { name: "Rose Philippine Duchesne", date: "11-18", bio: "French nun who founded schools for Native Americans and frontier settlers in Missouri.", patronOf: ["Against rejection"], memorial: "optional" },
  { name: "Presentation of the Blessed Virgin Mary", date: "11-21", bio: "Mary's presentation as a child in the Temple, dedicating her life to God.", patronOf: ["Consecrated life"], memorial: "memorial" },
  { name: "Cecilia", date: "11-22", bio: "Roman martyr who sang to God while being tortured. Survived beheading attempt and lived 3 more days.", patronOf: ["Musicians", "Singers", "Poets"], memorial: "memorial" },
  { name: "Clement I", date: "11-23", bio: "Fourth Pope after Peter who wrote important letter to Corinthians. Martyred by drowning with anchor.", patronOf: ["Marble workers", "Sailors"], memorial: "optional" },
  { name: "Andrew Dung-Lac and Companions", date: "11-24", bio: "117 Vietnamese martyrs killed between 1625-1886 during persecutions.", patronOf: ["Vietnam"], memorial: "memorial" },
  { name: "Catherine of Alexandria", date: "11-25", bio: "Young Christian philosopher martyred on a spiked wheel (which broke) then beheaded. Highly venerated in Middle Ages.", patronOf: ["Philosophers", "Preachers", "Students"], memorial: "optional" },
  { name: "Andrew", date: "11-30", bio: "Fisherman, brother of Peter, first apostle called by Jesus. Martyred on an X-shaped cross in Greece.", patronOf: ["Scotland", "Fishermen", "Russia"], memorial: "feast" },

  // December
  { name: "Francis Xavier", date: "12-03", bio: "Co-founder of Jesuits who brought Christianity to India, Southeast Asia, and Japan. 'Apostle of the Indies.'", patronOf: ["Missions", "Navigators", "Foreign missions"], memorial: "memorial" },
  { name: "John Damascene", date: "12-04", bio: "Syrian monk and Doctor whose defense of icons helped end iconoclasm. Last of the Greek Fathers.", patronOf: ["Icon painters", "Pharmacists"], memorial: "optional" },
  { name: "Nicholas", date: "12-06", bio: "Bishop of Myra famous for secret gift-giving to the poor. Basis for Santa Claus tradition.", patronOf: ["Children", "Sailors", "Pawnbrokers", "Greece"], memorial: "optional" },
  { name: "Ambrose", date: "12-07", bio: "Bishop of Milan and Doctor who baptized Augustine. Known for courage against emperors and beautiful hymns.", patronOf: ["Beekeepers", "Bishops", "Candle makers"], memorial: "memorial" },
  { name: "Immaculate Conception", date: "12-08", bio: "Mary conceived without original sin, prepared to be the Mother of God from the first moment of her existence.", patronOf: ["United States", "Purity"], memorial: "solemnity" },
  { name: "Juan Diego", date: "12-09", bio: "Indigenous Mexican to whom Our Lady of Guadalupe appeared in 1531, converting millions.", patronOf: ["Indigenous peoples"], memorial: "optional" },
  { name: "Our Lady of Loreto", date: "12-10", bio: "Commemoration of the Holy House of Nazareth, believed to have been miraculously transported to Loreto, Italy.", patronOf: ["Aviators"], memorial: "optional" },
  { name: "Damasus I", date: "12-11", bio: "Pope who commissioned Jerome to translate the Bible into Latin and promoted veneration of martyrs.", patronOf: ["Archaeologists"], memorial: "optional" },
  { name: "Our Lady of Guadalupe", date: "12-12", bio: "Mary's appearance to Juan Diego in Mexico, leaving her image miraculously imprinted on his tilma.", patronOf: ["Americas", "Unborn children"], memorial: "feast" },
  { name: "Lucy", date: "12-13", bio: "Sicilian virgin martyr who had her eyes gouged out (they were miraculously restored). Light-bearer in Advent darkness.", patronOf: ["The blind", "Eye disorders", "Writers"], memorial: "memorial" },
  { name: "John of the Cross", date: "12-14", bio: "Spanish Carmelite mystic and poet who reformed with Teresa. Wrote 'Dark Night of the Soul.' Doctor of the Church.", patronOf: ["Contemplatives", "Mystics"], memorial: "memorial" },
  { name: "Peter Canisius", date: "12-21", bio: "Dutch Jesuit who wrote catechisms that spread the Catholic faith in Germany during the Reformation.", patronOf: ["Germany", "Catholic press"], memorial: "optional" },
  { name: "John of Kanty", date: "12-23", bio: "Polish priest and professor who gave away his wealth and walked barefoot between cities to preach.", patronOf: ["Poland", "Lithuania"], memorial: "optional" },
  { name: "Stephen", date: "12-26", bio: "First Christian martyr, stoned to death in Jerusalem. His witness converted Saul (Paul).", patronOf: ["Deacons", "Stonemasons"], memorial: "feast" },
  { name: "John the Apostle", date: "12-27", bio: "The 'beloved disciple' who cared for Mary after Jesus' death. Author of Gospel, letters, and Revelation.", patronOf: ["Writers", "Theologians", "Friendship"], memorial: "feast" },
  { name: "Holy Innocents", date: "12-28", bio: "Children martyred by Herod in his attempt to kill the infant Jesus.", patronOf: ["Children", "Foundlings"], memorial: "feast" },
  { name: "Thomas Becket", date: "12-29", bio: "Archbishop of Canterbury martyred in his cathedral by knights of King Henry II for defending Church rights.", patronOf: ["Secular clergy"], memorial: "optional" },
  { name: "Sylvester I", date: "12-31", bio: "Pope during Constantine's reign who baptized the emperor and oversaw the Church's emergence from persecution.", patronOf: ["Against fever"], memorial: "optional" },
]

/**
 * Get the saint for a specific date
 */
export function getSaintForDate(date: Date): Saint | null {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${month}-${day}`
  
  return SAINTS_CALENDAR.find(saint => saint.date === dateStr) || null
}

/**
 * Get today's saint
 */
export function getTodaysSaint(): Saint | null {
  return getSaintForDate(new Date())
}
