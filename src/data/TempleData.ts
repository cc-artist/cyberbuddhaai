export interface Temple {
  id: number;
  name: string;
  location: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  route: { transport: string; itinerary: string; combination?: string };
  culture: string[];
  highlights: string[];
}

// 获取当前环境的基础URL
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  // 服务端渲染时使用环境变量或默认值
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
};

export const temples: Temple[] = [
  {
    id: 1,
    name: "Nanhua Temple",
    location: "Maba Town, Qujiang District, Shaoguan City, Guangdong Province",
    title: "Zen Ancestral Court, Dharma Preaching Site of Sixth Patriarch Huineng",
    description: "Nanhua Temple is an important ancestral court of Chinese Buddhist Zen. Sixth Patriarch Huineng preached here for 37 years, making it the birthplace of the Southern Zen sect. The temple houses the mummified body of Sixth Patriarch Huineng and numerous precious Buddhist cultural relics.",
    image: "/temple-images/南华寺.webp",
    features: [
      "Ancient Zen ancestral court with long history",
      "Housing place of Sixth Patriarch Huineng's mummified body",
      "Preserving numerous precious Buddhist cultural relics",
      "Tranquil environment suitable for meditation",
      "Professional meditation instructor guidance"
    ],
    route: {
      transport: "High-speed train to Shaoguan Station, then transfer to bus or private car",
      itinerary: "Day 1: Arrive in Shaoguan, check in hotel, evening class experience; Day 2: Morning class at Nanhua Temple, visit Sixth Patriarch Hall and Main Hall, meditation experience; Day 3: Visit surrounding attractions, return.",
      combination: "Can be combined with Danxia Mountain, Ruyuan Grand Canyon and other attractions"
    },
    culture: [
      "Zen culture experience",
      "Lecture on Sixth Patriarch Huineng's life story",
      "Meditation course experience",
      "Buddhist art appreciation",
      "Vegetarian culture experience"
    ],
    highlights: [
      "Birthplace of the Southern Zen sect",
      "Housing place of Sixth Patriarch Huineng's mummified body",
      "Tranquil environment suitable for meditation"
    ]
  },
  {
    id: 2,
    name: "Shaolin Temple",
    location: "At the foot of Wuru Peak, Songshan Mountain, Dengfeng City, Zhengzhou City, Henan Province",
    title: "Kung Fu Originates from Shaolin, Zen Ancestral Court",
    description: "Shaolin Temple is a world-famous Buddhist monastery and the birthplace of Chinese Kung Fu. The temple houses numerous historical relics and Buddhist artworks, and is one of the important ancestral courts of Chinese Buddhist Zen.",
    image: "/temple-images/少林寺.webp",
    features: [
      "Birthplace of Chinese Kung Fu",
      "One of the Zen ancestral courts",
      "Preserving numerous historical relics",
      "Spectacular Kung Fu performances",
      "Beautiful natural scenery of Songshan Mountain"
    ],
    route: {
      transport: "High-speed train to Zhengzhou Station, then transfer to special line bus",
      itinerary: "Day 1: Arrive in Zhengzhou, check in hotel; Day 2: Visit Shaolin Temple, watch Kung Fu performance, visit Pagoda Forest; Day 3: Climb Songshan Mountain, visit Songyang Academy, return.",
      combination: "Can be combined with Longmen Grottoes, White Horse Temple and other attractions"
    },
    culture: [
      "Shaolin Kung Fu experience",
      "Zen culture explanation",
      "Buddhist art appreciation",
      "Songshan Mountain culture experience",
      "Traditional martial arts learning"
    ],
    highlights: [
      "Birthplace of Chinese Kung Fu",
      "One of the Zen ancestral courts",
      "Spectacular Kung Fu performances"
    ]
  },
  {
    id: 3,
    name: "Lingyin Temple",
    location: "Lingyin Road, Xihu District, Hangzhou City, Zhejiang Province",
    title: "Ancient Monastery in Jiangnan, Dharma Site of Living Buddha Jigong",
    description: "Lingyin Temple is one of the ten ancient monasteries of Chinese Buddhist Zen. Founded in the first year of Xianhe in the Eastern Jin Dynasty, it has a history of over 1,600 years. The temple is nestled in a tranquil environment with ancient trees towering, and is a famous tourist attraction in Hangzhou.",
    image: "/temple-images/灵隐寺.webp",
    features: [
      "Ancient Jiangnan monastery with long history",
      "Dharma site of Living Buddha Jigong",
      "Tranquil environment with ancient trees",
      "Adjacent to West Lake, beautiful scenery",
      "Rich Buddhist cultural heritage"
    ],
    route: {
      transport: "Plane or high-speed train to Hangzhou, accessible by metro or bus",
      itinerary: "Day 1: Arrive in Hangzhou, check in hotel, visit West Lake; Day 2: Visit Lingyin Temple, Feilai Peak, taste vegetarian food; Day 3: Visit surrounding attractions, return.",
      combination: "Can be combined with West Lake, Qiandao Lake and other attractions"
    },
    culture: [
      "Buddhist culture experience",
      "Explanation of Jigong culture",
      "Appreciation of Feilai Peak stone carving art",
      "Jiangnan garden culture experience",
      "Vegetarian culture experience"
    ],
    highlights: [
      "One of the ten ancient monasteries of Chinese Buddhist Zen",
      "Dharma site of Living Buddha Jigong",
      "Adjacent to West Lake, beautiful scenery"
    ]
  },
  {
    id: 4,
    name: "Hanshan Temple",
    location: "No. 24, Hanshansi Lane, Gusu District, Suzhou City, Jiangsu Province",
    title: "Maple Bridge Night Mooring, Ancient Famous Monastery",
    description: "Hanshan Temple is a famous Chinese Buddhist monastery, renowned worldwide for the Tang Dynasty poet Zhang Ji's poem 'Maple Bridge Night Mooring'. The temple houses numerous historical relics and Buddhist artworks.",
    image: "/temple-images/寒山寺.webp",
    features: [
      "Ancient famous monastery with long history",
      "Poetic scene of 'Maple Bridge Night Mooring'",
      "Preserving numerous historical relics",
      "Suzhou garden-style architecture",
      "New Year bell blessing activity"
    ],
    route: {
      transport: "High-speed train to Suzhou Station, accessible by metro or bus",
      itinerary: "Day 1: Arrive in Suzhou, check in hotel, visit Pingjiang Road; Day 2: Visit Hanshan Temple, Maple Bridge, taste vegetarian food; Day 3: Visit Suzhou Gardens, return.",
      combination: "Can be combined with Humble Administrator's Garden, Tiger Hill and other attractions"
    },
    culture: [
      "Buddhist culture experience",
      "Explanation of Tang poetry culture",
      "Appreciation of Suzhou garden art",
      "Jiangnan water town culture experience",
      "New Year bell blessing"
    ],
    highlights: [
      "Poetic scene of 'Maple Bridge Night Mooring'",
      "Suzhou garden-style architecture",
      "Famous New Year bell blessing activity"
    ]
  },
  {
    id: 5,
    name: "White Horse Temple",
    location: "Baimasi Town, Luolong District, Luoyang City, Henan Province",
    title: "China's First Ancient Monastery, First Official Buddhist Temple in China",
    description: "White Horse Temple is the first official Buddhist temple built after Buddhism was introduced to China. It is known as the 'ancestral court' and 'source of Buddhism' in Chinese Buddhism, with a history of over 1,900 years.",
    image: "/temple-images/白马寺.jpg",
    features: [
      "China's first ancient monastery",
      "First official Buddhist temple in China",
      "Preserving numerous historical relics",
      "International Buddha Hall Garden, gathering Buddhist architectures from various countries",
      "Beautiful scenery during Luoyang Peony Cultural Festival"
    ],
    route: {
      transport: "High-speed train to Luoyang Station, accessible by bus or private car",
      itinerary: "Day 1: Arrive in Luoyang, check in hotel; Day 2: Visit White Horse Temple, International Buddha Hall Garden, taste vegetarian food; Day 3: Visit Longmen Grottoes, return.",
      combination: "Can be combined with Longmen Grottoes, Guanlin Temple and other attractions"
    },
    culture: [
      "Buddhist culture experience",
      "Explanation of Chinese Buddhism development history",
      "Appreciation of international Buddhist architecture art",
      "Luoyang peony culture experience",
      "Traditional Buddhist ceremony experience"
    ],
    highlights: [
      "China's first ancient monastery",
      "First official Buddhist temple in China",
      "International Buddha Hall Garden gathering Buddhist architectures from various countries"
    ]
  },
  {
    id: 6,
    name: "Ta'er Monastery",
    location: "No. 56, Jinta Road, Huangzhong District, Xining City, Qinghai Province",
    title: "One of the Six Major Monasteries of Gelug Sect in Tibetan Buddhism, Birthplace of Master Tsongkhapa",
    description: "Ta'er Monastery is one of the six major monasteries of the Gelug Sect in Tibetan Buddhism and the birthplace of Master Tsongkhapa. The monastery houses numerous Tibetan Buddhist artworks and precious cultural relics.",
    image: "/temple-images/塔尔寺.webp",
    features: [
      "One of the six major monasteries of Gelug Sect in Tibetan Buddhism",
      "Birthplace of Master Tsongkhapa",
      "Preserving numerous Tibetan Buddhist artworks",
      "Butter sculptures, murals, and applique embroideries known as the 'Three Wonders of Ta'er Monastery'",
      "Rich Tibetan cultural experiences"
    ],
    route: {
      transport: "Plane to Xining Caojiabao Airport, accessible by bus or private car",
      itinerary: "Day 1: Arrive in Xining, check in hotel, acclimatize to plateau climate; Day 2: Visit Ta'er Monastery, experience Tibetan culture; Day 3: Visit Qinghai Lake, return.",
      combination: "Can be combined with Qinghai Lake, Chaka Salt Lake and other attractions"
    },
    culture: [
      "Tibetan Buddhist culture experience",
      "Explanation of Master Tsongkhapa's life",
      "Appreciation of the 'Three Wonders of Ta'er Monastery' art",
      "Tibetan folk culture experience",
      "Plateau natural scenery experience"
    ],
    highlights: [
      "One of the six major monasteries of Gelug Sect in Tibetan Buddhism",
      "Birthplace of Master Tsongkhapa",
      "Famous 'Three Wonders of Ta'er Monastery' art"
    ]
  },
  {
    id: 7,
    name: "Lingshan Grand Buddha",
    location: "Mashan, Wuxi City, Jiangsu Province",
    title: "World's Tallest Bronze Sakyamuni Statue, Buddhist Cultural Theme Park",
    description: "Lingshan Grand Buddha is located in the beautiful Wuxi Mashan, north of Lingshan, south of Taihu Lake. It perfectly combines the long-standing Buddhist culture with the beautiful natural landscape. It is the most complete and the only Buddhist cultural theme park in China that focuses on displaying the achievements of Sakyamuni. The Lingshan Grand Buddha is the iconic landscape of Lingshan Scenic Area. The Lingshan Grand Buddha is 88 meters high and uses a total of 725 tons of copper. Together with the Tian Tan Buddha in Hong Kong in the south, the Leshan Giant Buddha in Sichuan in the west, the Yungang Giant Buddha in Shanxi in the north, and the Longmen Giant Buddha in Luoyang in Henan in the Central Plains, they are collectively known as the \"Five Buddhas in Five Directions of China\".",
    image: "/temple-images/灵山大佛.jpg",
    features: [
      "World's tallest bronze Sakyamuni statue",
      "Complete Buddhist cultural theme park",
      "Beautiful natural landscape combined with Buddhist culture",
      "Multiple iconic attractions including Lingshan Grand Buddha, Nine Dragons Bathing, and Brahma Palace",
      "Rich cultural performances and activities"
    ],
    route: {
      transport: "High-speed train to Wuxi Station, then transfer to bus or private car",
      itinerary: "Day 1: Arrive in Wuxi, check in hotel, evening visit to nearby attractions; Day 2: Visit Lingshan Scenic Area (Lingshan Grand Buddha, Xiangfu Temple, Nine Dragons Bathing, Brahma Palace, Five Seal Altar City); Day 3: Visit surrounding attractions, return.",
      combination: "Can be combined with Taihu Lake, Wuxi Ancient Canal and other attractions"
    },
    culture: [
      "Buddhist culture experience",
      "Visit to Lingshan Grand Buddha and Brahma Palace",
      "Watching cultural performances like 'Lingshan Auspicious Song'",
      "Experiencing vegetarian food culture",
      "Understanding Chinese Buddhist history and art"
    ],
    highlights: [
      "World's tallest bronze Sakyamuni statue",
      "Spectacular Nine Dragons Bathing performance",
      "Brahma Palace known as 'Oriental Louvre'",
      "Five Seal Altar City with Tibetan architecture",
      "Millennium-old Xiangfu Temple"
    ]
  },
  {
    id: 8,
    name: "Foding Palace",
    location: "Niushou Mountain Cultural Tourism Zone, Jiangning District, Nanjing City, Jiangsu Province",
    title: "World Heritage Site, Home to Buddha's Topknot Relic",
    description: "Foding Palace is located in the Niushou Mountain Cultural Tourism Zone, Jiangning District, Nanjing City, Jiangsu Province. It is a pit building built on the basis of abandoned mine pits. It has long enshrined the Buddha's topknot relic of Sakyamuni. It integrates architectural wonders, Buddhist art and cultural experience. It is an important cultural landmark in Nanjing and a world-class tourist destination, known as 'China's New Peak of Contemporary Buddhist Art'.",
    image: "/temple-images/佛顶宫.webp",
    features: [
      "Home to Buddha's topknot relic",
      "Unique pit building architecture",
      "World-class Buddhist art collection",
      "Integrating architectural wonders, Buddhist art and cultural experience",
      "Important cultural landmark in Nanjing"
    ],
    route: {
      transport: "High-speed train to Nanjing South Station, then transfer to bus or private car",
      itinerary: "Day 1: Arrive in Nanjing, check in hotel, visit city attractions; Day 2: Visit Foding Palace in Niushou Mountain Cultural Tourism Zone, experience Buddhist culture; Day 3: Visit surrounding attractions, return.",
      combination: "Can be combined with Nanjing Confucius Temple, Ming Xiaoling Mausoleum and other attractions"
    },
    culture: [
      "Buddhist culture experience",
      "Visit to Foding Palace and Buddha's topknot relic",
      "Appreciation of Buddhist art and architecture",
      "Understanding the history of Buddha's relics",
      "Experiencing traditional Chinese Buddhist culture"
    ],
    highlights: [
      "Home to Buddha's topknot relic",
      "Unique pit building architecture",
      "World-class Buddhist art collection",
      "Spectacular Zen Grand View lighting show",
      "Five-story underground palace with stunning design"
    ]
  },
  {
    id: 9,
    name: "Mogao Caves",
    location: "25 kilometers southeast of Dunhuang City, Gansu Province, at the western end of the Hexi Corridor",
    title: "Oriental Louvre, World Cultural Heritage Monument on the Silk Road",
    description: "Mogao Caves — known as the 'Oriental Louvre' — boasts 735 caves, 45,000 square meters of murals, and over 2,400 painted sculptures. It stands as a monument of civilization along the Silk Road. This exclusive tour specially arranges access to special caves not open to regular tourists, including Cave 45 whose Tang Dynasty painted sculptures are praised as 'the most beautiful sculptural group in Mogao Caves', and Cave 57 whose 'Beauty Bodhisattva' is world-renowned for its elegant and dignified charm.",
    image: "/temple-images/莫高窟.webp",
    features: [
      "Exclusive private tour of Mogao Caves 'Secret Special Caves'",
      "Desert starry sky private banquet",
      "Top luxury Oriental aesthetic accommodation",
      "Intangible cultural heritage handcraft inheritance",
      "VIP exclusive service throughout the journey"
    ],
    route: {
      transport: "International flight to Dunhuang, with exclusive Mercedes-Benz business vehicle transfer throughout",
      itinerary: "Day 1: Arrive in Dunhuang, check in at Dongyi Dunhuang Hotel (SLH member), welcome dinner; Day 2: Exclusive tour of 2 special caves + 6 regular caves with Dunhuang Academy scholar, evening desert starry sky private banquet at Mingsha Mountain; Day 3: Intangible cultural heritage workshop at Dunhuang Academy, complete clay painting creation under guidance of mural restorer; Day 4: Free time or optional activities, departure.",
      combination: "Can be combined with Mingsha Mountain Crescent Spring, Yumen Pass, Yangguan, and other Silk Road attractions"
    },
    culture: [
      "Witness to the convergence of four major civilizations",
      "1,600 years of continuous Buddhist art",
      "Deep interpretation of artistic fusion from Persia, India, and China",
      "Understanding the evolution of artistic styles across dynasties",
      "Learning the stories of 'Dunhuang Guardians'"
    ],
    highlights: [
      "Mogao Caves 'Secret Special Caves' exclusive tour with Dunhuang Academy scholar",
      "Desert starry sky private banquet with Michelin-star chef customized Silk Road menu",
      "Two consecutive nights at Dongyi Dunhuang Hotel (SLH Global Luxury Boutique member)",
      "Exclusive intangible cultural heritage workshop at Dunhuang Academy",
      "2:1 service ratio with exclusive butler and cultural ambassador"
    ]
  },
  {
    id: 10,
    name: "Black Myth: Wukong - Shanxi Ancient Architecture Cluster",
    location: "Shanxi Province, China (Xiaoxitian, Guangsheng Temple, Shuanglin Temple, Zhenguo Temple, Tiefo Temple, Lingyan Temple)",
    title: "Journey to the West in Reality - Black Myth Wukong Filming Locations",
    description: "Shanxi Ancient Architecture Cluster - The domestically produced AAA game 'Black Myth: Wukong' selected 36 filming locations across China, 27 of which are in Shanxi. This itinerary focuses on the core game scenes: Xiaoxitian in Xi County is known as the 'Masterpiece of Chinese Suspended Sculpture Art' with thousands of suspended sculptures covering the ceiling; Feihong Pagoda at Guangsheng Temple in Hongtong is the most complete existing glazed pagoda in China, with Ming Dynasty craftsmen outlining the Journey to the West story with peacock blue glaze; Shuanglin Temple in Pingyao has over 2,000 painted sculptures with various forms, and the Weituo statue is known as the 'Best Weituo in the World' with its 'flexibility within rigidity'; Zhenguo Temple's Ten-Thousand-Buddha Hall is a legacy of the Five Dynasties and one of the oldest wooden structures in China; Twenty-Four Devas painted sculptures at Tiefo Temple in Gaoping show the majesty of Buddhist guardian deities with exaggerated body language; Lingyan Temple's Pagoda Forest in Jinan is the ashram of Tang Dynasty eminent monks, praised by Liang Qichao as the 'Best Painted Sculptures in China'.",
    image: "/temple-images/fHPlMoqxg.jpg",
    features: [
      "Black Myth: Wukong 'filming locations' special tour",
      "Accompanied by scholars from Shanxi Ancient Architecture Research Institute",
      "In-depth decryption of the correspondence between game scenes and real cultural relics",
      "Visiting mural restoration sites and painted sculpture archives not open to ordinary groups",
      "Private ancient architecture art class",
      "Intangible cultural heritage handcraft - mural copying and Wukong-themed painted sculpture creation"
    ],
    route: {
      transport: "High-speed train to Taiyuan, with exclusive luxury business vehicle transfer throughout",
      itinerary: "Day 1: Arrive in Taiyuan, check in at Yunjincheng Mansion (Qing Dynasty ticket office transformed, national cultural heritage site), welcome dinner with Shanxi merchant culture experience; Day 2: Exclusive tour of Xiaoxitian with Shanxi Ancient Architecture Research Institute scholar, visit mural restoration site; Day 3: Visit Guangsheng Temple Feihong Pagoda, touch Ming Dynasty glaze with colored glaze fragment specimen; Day 4: Private class at Shuanglin Temple Thousand-Buddha Hall, cultural relic restorer explains the dynamic aesthetic code of Weituo statue; Day 5: Visit Zhenguo Temple, experiencing Five Dynasties wooden architecture; Day 6: Intangible cultural heritage workshop at Tiefo Temple, complete Wukong-themed painted sculpture under guidance of ancient architecture painting inheritor; Day 7: One night at Lingyan Temple Zen Meditation Courtyard, experiencing 'Wukong cultivation' atmosphere with morning bells and evening drums; Day 8: Free time or optional activities, departure.",
      combination: "Can be combined with Pingyao Ancient City, Yungang Grottoes, Wutai Mountain and other attractions"
    },
    culture: [
      "Game and ancient architecture 'double narrative' experience",
      "Suspended sculpture art 'full hall glory' interpretation",
      "Journey to the West code on the glazed pagoda",
      "Intangible cultural heritage handcraft inheritance",
      "Zen meditation experience"
    ],
    highlights: [
      "Black Myth: Wukong 'filming locations' special tour with Shanxi Ancient Architecture Research Institute scholar accompaniment",
      "Ancient architecture art private class: Shuanglin Temple Weituo statue dynamic aesthetics, Guangsheng Temple Feihong Pagoda Ming Dynasty glaze",
      "Oriental aesthetics top luxury accommodation: 3 consecutive nights at Pingyao Ancient City Yunjincheng Mansion, 1 night at Lingyan Temple Zen Meditation Courtyard",
      "Intangible cultural heritage handcraft: Wukong-themed painted sculpture creation at Tiefo Temple Jincheng Intangible Cultural Heritage Workshop",
      "2:1 service ratio, full VIP privileges, all-inclusive price with zero hidden consumption"
    ]
  }
];
