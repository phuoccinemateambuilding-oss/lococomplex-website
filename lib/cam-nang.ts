// Cẩm nang LOCO Complex — khối chữ dài trên trang chủ VI (/) và EN (/en), đợt 23/10/2026.
// Nguồn sự kiện: lib/site.ts (địa chỉ, giờ, hotline), i18n/*.json (2 tầng, dòng nhạc, tiện ích, bảng bàn,
// quy định, BITES, menu 5 trang), rule dự án 02/03 (NEWTRO, tagline, logo, poster FRIENDZONE), ảnh fanpage
// + video chính chủ trên SSD Nightclub-Media/Sài Gòn/Loco. KHÔNG ghi: số tiền, sức chứa, chỗ gửi xe,
// tên DJ / nghệ sĩ, đánh giá sao. Text tránh từ "bar" và tên đồ uống theo rule 07 của dự án.
import { site } from "@/lib/site";

export type CamNangItem = { name: string; body: string };
export type CamNangLinkKey = "menu" | "gallery" | "faq" | "book" | "contact";

export type CamNangSection = {
  id: string;
  h: string;
  p: string[];
  items?: CamNangItem[];
  after?: string[];
  /** chỉ số ảnh (0-based, theo CAM_NANG_PHOTOS) hiện dưới mục */
  photos?: number[];
  link?: { key: CamNangLinkKey; label: string };
  cta?: boolean;
};

export type CamNangCopy = {
  kicker: string;
  title: string;
  lead: string;
  tocTitle: string;
  sections: CamNangSection[];
  call: string;
  zalo: string;
  bookPage: string;
  linksTitle: string;
  links: Array<{ key: CamNangLinkKey; label: string; sub: string }>;
  alts: string[];
};

/** [tên file trong /assets/loco/cam-nang, rộng, cao] — bản lớn; bản "-800" cùng tên.
 *  cn-01 → cn-06: ảnh fanpage chính chủ (Heatroom) chưa dùng trên web; cn-07, cn-08: khung hình video chính chủ. */
export const CAM_NANG_PHOTOS: Array<[string, number, number]> = [
  ["cn-01", 1600, 1067],
  ["cn-02", 1600, 1097],
  ["cn-03", 1600, 1108],
  ["cn-04", 1600, 1066],
  ["cn-05", 1600, 1429],
  ["cn-06", 1600, 1067],
  ["cn-07", 540, 960],
  ["cn-08", 540, 960],
];

export const CAM_NANG_VI: CamNangCopy = {
  kicker: "Cẩm nang",
  title: "Cẩm nang LOCO Complex",
  lead:
    "Lần đầu tới LOCO Complex ở 11 Nam Quốc Cang? Cẩm nang này gom những điều nên biết trước khi đi: hai tầng club khác nhau thế nào, Heatroom trông ra sao, nhạc gì, chọn bàn ở đâu, đặt bàn và đi đường nào. Thông tin dựa trên dữ liệu chính thức của LOCO cùng ảnh và video thật quay tại club.",
  tocTitle: "Trong cẩm nang này",
  sections: [
    {
      id: "tong-quan",
      h: "LOCO Complex là nơi như thế nào?",
      p: [
        `LOCO Complex là tổ hợp giải trí về đêm ở ${site.address.vi}. Trong cùng một toà nhà có hai tầng club với hai chất nhạc khác nhau: tầng 1 là Hip-hop Club, tầng 2 là LOCO Heatroom, một mini nightclub. Đi kèm là BITES, góc ẩm thực phục vụ đồ ăn nhẹ. Vì thế dù bạn tìm LOCO, LOCO Complex hay LOCO Heatroom thì cũng là cùng một địa chỉ.`,
        "LOCO gọi phong cách của mình là NEWTRO, pha giữa hoài cổ và mới mẻ theo gu Gen Z, với khẩu hiệu “make impossible”. Logo gồm hai khối hình học màu đỏ, một hình vuông khoét tròn trắng ở giữa và một hình tròn mang ngôi sao tám cánh, đi cùng hai chú ngựa đen quàng khăn xanh ngọc và xanh dương. Logo còn đổi theo mùa, chẳng hạn gắn thêm huy hiệu vàng New Year dịp Tết. Màu mạnh, nhãn dán xoay nghiêng và nhân vật hoạt hình là chất liệu bạn sẽ gặp lại khắp không gian.",
        `Club mở cửa ${site.hours.vi}. Ngoài hai sàn nhạc, LOCO còn có sân thượng ngoài trời, khu trò chơi, ghế massage, chỗ sạc điện thoại và tủ đồ cá nhân, nên một buổi tối dài ở đây có nhiều chỗ để nghỉ chân giữa các lượt nhảy.`,
      ],
    },
    {
      id: "heatroom",
      h: "Heatroom: đĩa trần lấp lánh và những vòng đèn tròn",
      p: [
        "Heatroom ở tầng 2 là nơi xuất hiện nhiều nhất trong ảnh của club. Dễ nhận ra ngay là chiếc đĩa tròn lớn gắn trên trần, mặt đĩa lấp lánh như phủ mảnh pha lê và đổi màu theo đèn: lúc đỏ rực, lúc tím, lúc xanh ngọc. Quanh đĩa là những vòng đèn tròn treo ở nhiều độ cao, nhìn từ sàn lên giống một khoảng trời đầy quầng sáng.",
        "Bốt DJ đặt sát đám đông, khách đứng ngay cạnh bàn mix và giơ điện thoại chụp cùng DJ. Trang trí mang đậm chất hoạt hình: những khối cầu đỏ khổng lồ, đầu linh vật bơm hơi màu cam, đèn hình chú thỏ mắt chữ X, cả người hoá trang linh vật gấu đi giữa sàn. Đây là kiểu không gian để nhảy và chụp ảnh hơn là ngồi yên một chỗ.",
        "Tầng 1 Hip-hop Club dành cho Hip-hop và R&B, hợp nhóm thích nhịp chắc và chậm hơn so với sàn Heatroom phía trên.",
      ],
      photos: [0, 1, 2, 4, 6],
      link: { key: "gallery", label: "Xem thêm hình ảnh LOCO Complex" },
    },
    {
      id: "am-nhac",
      h: "Âm nhạc và các đêm chủ đề",
      p: [
        "Hai tầng là hai thế giới âm nhạc. Heatroom chơi Top 40, EDM và House với hệ thống âm thanh, ánh sáng dựng riêng cho sàn nhỏ; tầng 1 dành cho Hip-hop và R&B. DJ thường trú giữ nhịp mỗi đêm, và có những tối nghệ sĩ khách mời cầm micro ngay giữa đám đông.",
        "LOCO thích dựng đêm theo chủ đề. Poster nhận diện của club giới thiệu đêm FRIENDZONE tại Heatroom; ảnh trên fanpage có tối “Danger – LOCO is on fire” với đội hoá trang lính cứu hoả giơ biển cảnh báo; video của club ghi lại màn chào năm mới 2026, khi MC giơ tấm biển Happy New Year giữa sàn. Lịch chủ đề đổi liên tục, nên trước khi đi hãy hỏi hotline xem tối đó có gì.",
      ],
      photos: [3, 5, 7],
    },
    {
      id: "chon-ban",
      h: "Chọn bàn ở tầng nào?",
      p: ["Mỗi tầng xếp bàn theo cách riêng. Tên bàn và số khách dưới đây lấy theo bảng bàn đang công bố trên web:"],
      items: [
        { name: "Tầng 1 · Bàn B", body: "Cho 1 đến 4 khách, hợp nhóm nhỏ cần chỗ đặt đồ." },
        { name: "Tầng 1 · Standing", body: "Bàn đứng gần sàn, cho người đến để nhảy là chính." },
        { name: "Tầng 1 · L-Zone Sofa", body: "Sofa hình chữ L cho 1 đến 8 khách." },
        { name: "Tầng 1 · VIP và SVIP", body: "VIP cho 1 đến 10 khách, SVIP cho 1 đến 12 khách, dành cho tiệc nhóm lớn." },
        { name: "Tầng 2 Heatroom · Standing", body: "Bàn đứng cho 1 đến 4 khách, ngay trong không khí của sàn." },
        {
          name: "Tầng 2 Heatroom · Premium Sofa và VIP Sofa",
          body: "Premium Sofa cho 1 đến 8 khách; VIP Sofa nhận tới 15 khách, hợp sinh nhật hay buổi họp mặt đông người.",
        },
      ],
      after: [
        "Một cách chọn nhanh: đi hai, ba người và đến để nhảy là chính thì bàn Standing ở tầng nào cũng hợp; nhóm bốn người muốn có chỗ ngồi thì xem Bàn B ở tầng 1; nhóm sáu đến tám người hợp L-Zone Sofa hoặc Premium Sofa; từ mười người trở lên thì VIP, SVIP hoặc VIP Sofa ở Heatroom mới đủ chỗ cho cả đoàn.",
        "Giá bàn tuỳ vị trí, số khách và ngày trong tuần, nên cẩm nang không ghi con số; nhân viên sẽ báo mức cụ thể khi bạn gọi. Nếu chưa chắc nhóm mình hợp tầng nào, cứ nói số người và gu nhạc, đội ngũ LOCO sẽ gợi ý.",
      ],
    },
    {
      id: "bites-menu",
      h: "BITES và menu LOCO",
      p: [
        "BITES là góc ẩm thực trong LOCO Complex, phục vụ suốt đêm với các món ăn nhẹ dễ chia cho cả bàn như xúc xích, gà viên chiên, pizza phô mai và đĩa trái cây. Menu đầy đủ của club gói trong 5 trang, có một trang combo riêng cho nhóm bạn; bạn có thể xem từng trang hoặc lật cả cuốn ngay trên web.",
        "Giá trên menu chưa gồm thuế và phí dịch vụ, danh mục có thể đổi theo từng đêm, nên hãy hỏi lại hotline trước khi chốt set cho nhóm đông.",
      ],
      link: { key: "menu", label: "Xem menu LOCO Complex 5 trang" },
    },
    {
      id: "dat-ban",
      h: "Đặt bàn LOCO Complex",
      p: ["Có ba cách giữ bàn, chọn cách nào tiện cho bạn:"],
      items: [
        {
          name: `Gọi hotline ${site.phone}`,
          body: "Báo ngày, giờ đến, số khách và tầng muốn ngồi; nhân viên kiểm tra chỗ rồi xác nhận lại.",
        },
        {
          name: `Nhắn Zalo ${site.phone}`,
          body: "Tiện để hỏi lịch chủ đề trong tuần, xin bảng giá bàn hoặc gửi yêu cầu riêng cho tiệc sinh nhật.",
        },
        {
          name: "Điền form trên trang Đặt bàn",
          body: "Để lại họ tên, số điện thoại, ngày, giờ đến và số khách; đội ngũ LOCO gọi lại để chốt chỗ.",
        },
      ],
      after: [
        "Đặt trước giúp giữ đúng tầng và loại bàn mong muốn, nhất là khi đi đông hoặc vào những tối có chủ đề đặc biệt.",
      ],
      cta: true,
    },
    {
      id: "duong-den",
      h: "Đường đến 11 Nam Quốc Cang",
      p: [
        `LOCO Complex nằm ở ${site.address.vi}. Gõ “LOCO Complex” hoặc “11 Nam Quốc Cang” trên ứng dụng bản đồ là ra đúng vị trí; trang liên hệ của web có bản đồ nhúng để bạn mở chỉ đường.`,
        "Nam Quốc Cang là một con phố nhỏ thuộc phường Phạm Ngũ Lão, ngay trung tâm Quận 1, nên đi taxi hay xe công nghệ đều dễ tìm. Nếu đi theo nhóm, hẹn nhau trước cửa rồi vào cùng lúc để được xếp bàn một lần.",
      ],
      link: { key: "contact", label: "Mở bản đồ và thông tin liên hệ" },
    },
    {
      id: "luu-y",
      h: "Quy định và lưu ý trước khi đến",
      p: [],
      items: [
        {
          name: "Chỉ dành cho khách từ 18 tuổi",
          body: "Mang theo căn cước công dân hoặc hộ chiếu, vì nhân viên có thể kiểm tra giấy tờ ở cửa.",
        },
        { name: "Trang phục", body: "Dress code của LOCO là trẻ trung, thanh lịch." },
        { name: "Không mang thức ăn từ ngoài vào", body: "Club không nhận thức ăn và thức uống mang từ bên ngoài." },
        { name: "Giờ mở cửa", body: `LOCO mở cửa ${site.hours.vi}; nên giữ bàn trước nếu định đến vào tối cuối tuần.` },
      ],
      link: { key: "faq", label: "Đọc thêm câu hỏi thường gặp về LOCO" },
    },
    {
      id: "dip-phu-hop",
      h: "LOCO hợp với dịp nào?",
      p: [],
      items: [
        {
          name: "Sinh nhật và tiệc nhóm",
          body: "VIP Sofa ở Heatroom nhận tới 15 khách, SVIP tầng 1 tới 12 khách; báo trước để được xếp chỗ liền nhau.",
        },
        {
          name: "Đêm chủ đề cùng hội bạn",
          body: "Theo dõi các đêm hoá trang, FRIENDZONE hay tiệc chào năm mới để có một buổi tối khác hẳn thường lệ.",
        },
        { name: "Người mê Hip-hop", body: "Tầng 1 dành trọn cho Hip-hop và R&B." },
        { name: "Người thích EDM và House", body: "Lên Heatroom, đứng gần bốt DJ dưới chiếc đĩa trần đổi màu." },
      ],
    },
  ],
  call: "Gọi",
  zalo: "Zalo",
  bookPage: "Trang đặt bàn",
  linksTitle: "Xem tiếp trên website",
  links: [
    { key: "menu", label: "Menu LOCO Complex", sub: "5 trang, xem từng trang hoặc lật cả cuốn" },
    { key: "gallery", label: "Hình ảnh LOCO", sub: "Heatroom, tầng Hip-hop, các đêm chủ đề" },
    { key: "faq", label: "Câu hỏi thường gặp", sub: "Giờ mở cửa, đặt bàn, dress code" },
    { key: "book", label: "Đặt bàn LOCO", sub: "Form giữ chỗ, hotline, Zalo" },
  ],
  alts: [
    "Đĩa trần LOCO Heatroom phát sáng xanh ngọc, các vòng đèn tròn treo trên đám đông đang nhảy",
    "Sàn Heatroom nhuộm đỏ với những khối cầu đỏ khổng lồ, nhìn từ phía bàn mix của DJ",
    "Đầu linh vật bơm hơi màu cam và đèn lồng tròn treo trên đám đông tại LOCO Heatroom",
    "Nghệ sĩ khách mời cầm micro biểu diễn dưới đĩa trần Heatroom, khách giơ điện thoại quay lại",
    "Nhóm khách chụp ảnh cùng DJ ngay cạnh bàn mix tại LOCO Heatroom",
    "Đêm chủ đề “LOCO is on fire” với người hoá trang lính cứu hoả giơ biển cảnh báo",
    "Khách nhảy dưới đĩa trần đổi màu tím tại LOCO Heatroom",
    "MC giơ tấm biển Happy New Year 2026 trong tiệc chào năm mới tại LOCO Complex",
  ],
};

export const CAM_NANG_EN: CamNangCopy = {
  kicker: "Guide",
  title: "LOCO Complex guide",
  lead:
    "First time at LOCO Complex on 11 Nam Quoc Cang? This guide gathers what helps to know before you go: how the two club floors differ, what Heatroom looks like, the music, where to sit, how to book and how to get there. It is based on LOCO's official information and real photos and videos shot inside the club.",
  tocTitle: "In this guide",
  sections: [
    {
      id: "tong-quan",
      h: "What kind of place is LOCO Complex?",
      p: [
        `LOCO Complex is a nightlife complex at ${site.address.en}. One building holds two club floors with two different sounds: Floor 1 is the Hip-hop Club and Floor 2 is LOCO Heatroom, a mini nightclub. Alongside them is BITES, the food corner serving light bites. So whether you search for LOCO, LOCO Complex or LOCO Heatroom, it is the same address.`,
        "LOCO calls its style NEWTRO, a mix of retro and new shaped by Gen Z taste, under the slogan “make impossible”. The logo pairs two red geometric shapes, a square with a white circle cut out and a circle carrying an eight-point star, with two black horses wearing teal and blue scarves. The logo also changes with the seasons, for example gaining a gold New Year badge at Tet. Bold colour, tilted sticker-style labels and cartoon characters are the materials you will spot all over the venue.",
        `The club is open ${site.hours.en}. Besides the two dance floors, LOCO has an outdoor terrace, a game zone, massage chairs, phone charging and personal lockers, so a long night here has plenty of places to take a break between sets.`,
      ],
    },
    {
      id: "heatroom",
      h: "Heatroom: a glittering ceiling disc and rings of light",
      p: [
        "Heatroom on Floor 2 is the room that shows up most in the club's photos. The first thing you notice is a large round disc fixed to the ceiling, its surface glittering as if covered in crystal shards and changing colour with the lights: fiery red, purple, then aqua. Around it hang rings of light at different heights, so looking up from the floor feels like a sky full of halos.",
        "The DJ booth sits right against the crowd, with guests standing next to the decks and holding up phones for photos with the DJ. The decor leans fully into cartoon: giant red spheres, inflatable orange mascot heads, X-eyed bunny lamps and even a dancer in a bear mascot costume moving through the room. This is a space for dancing and photos rather than sitting still.",
        "Floor 1, the Hip-hop Club, is dedicated to Hip-hop and R&B, a good fit for groups who like a steadier, slower groove than the Heatroom floor upstairs.",
      ],
      photos: [0, 1, 2, 4, 6],
      link: { key: "gallery", label: "See more LOCO Complex photos" },
    },
    {
      id: "am-nhac",
      h: "Music and themed nights",
      p: [
        "Two floors, two musical worlds. Heatroom plays Top 40, EDM and House on a sound and lighting rig built for a small floor, while Floor 1 is all about Hip-hop and R&B. Resident DJs hold the night, and on some evenings guest artists take the mic right in the middle of the crowd.",
        "LOCO loves a theme. The club's identity poster introduces the FRIENDZONE night at Heatroom; fanpage photos show a “Danger – LOCO is on fire” night with a crew dressed as firefighters holding warning signs; and the club's video captures the welcome to 2026, with the MC raising a Happy New Year sign on the floor. Themes change constantly, so ask the hotline what is on before you go.",
      ],
      photos: [3, 5, 7],
    },
    {
      id: "chon-ban",
      h: "Which floor and which table?",
      p: ["Each floor arranges its tables differently. The table names and group sizes below follow the table list published on this website:"],
      items: [
        { name: "Floor 1 · B Table", body: "For 1 to 4 guests, good for a small group that needs somewhere to put things down." },
        { name: "Floor 1 · Standing", body: "Standing tables near the floor, for people who come mainly to dance." },
        { name: "Floor 1 · L-Zone Sofa", body: "An L-shaped sofa for 1 to 8 guests." },
        { name: "Floor 1 · VIP and SVIP", body: "VIP for 1 to 10 guests and SVIP for 1 to 12 guests, made for big group parties." },
        { name: "Floor 2 Heatroom · Standing", body: "Standing tables for 1 to 4 guests, right in the energy of the floor." },
        {
          name: "Floor 2 Heatroom · Premium Sofa and VIP Sofa",
          body: "Premium Sofa seats 1 to 8 guests; VIP Sofa takes up to 15, a good match for birthdays or big get-togethers.",
        },
      ],
      after: [
        "A quick way to choose: two or three people who mainly want to dance will be happy at a Standing table on either floor; a group of four wanting seats should look at the B Table on Floor 1; six to eight people fit an L-Zone Sofa or a Premium Sofa; and from ten guests up, only VIP, SVIP or the Heatroom VIP Sofa has room for the whole party.",
        "Table rates depend on position, group size and the day of the week, so this guide leaves out the figures; staff will quote the exact terms when you call. If you are not sure which floor suits your group, just give your headcount and music taste and the LOCO team will suggest one.",
      ],
    },
    {
      id: "bites-menu",
      h: "BITES and the LOCO menu",
      p: [
        "BITES is the food corner inside LOCO Complex, serving all night with easy-to-share bites such as sausages, chicken nuggets, cheese pizza and fruit platters. The club's full menu runs to 5 pages, including a combo page for groups of friends; you can open each page or flip through the whole book right on the website.",
        "Menu prices exclude tax and service charge and the list can change from night to night, so check with the hotline before settling on a set for a big group.",
      ],
      link: { key: "menu", label: "See the 5-page LOCO Complex menu" },
    },
    {
      id: "dat-ban",
      h: "Booking LOCO Complex",
      p: ["There are three ways to hold a table; use whichever suits you:"],
      items: [
        {
          name: `Call ${site.phone}`,
          body: "Give the date, arrival time, group size and the floor you prefer; staff check availability and confirm.",
        },
        {
          name: `Zalo or WhatsApp ${site.phone}`,
          body: "Handy for asking about this week's themes, requesting table rates or sending special requests for a birthday.",
        },
        {
          name: "Use the booking form",
          body: "Leave your name, phone number, date, arrival time and group size, and the LOCO team will call back to lock in your table.",
        },
      ],
      after: [
        "Booking ahead secures the floor and table type you want, especially for larger groups or on special theme nights.",
      ],
      cta: true,
    },
    {
      id: "duong-den",
      h: "Getting to 11 Nam Quoc Cang",
      p: [
        `LOCO Complex is at ${site.address.en}. Search “LOCO Complex” or “11 Nam Quoc Cang” in any map app to land on the right spot; the website's contact page has an embedded map you can open for directions.`,
        "Nam Quoc Cang is a small street in Pham Ngu Lao Ward, right in central District 1, so taxis and ride-hailing drivers find it easily. If you are coming as a group, meet outside and walk in together so you can be seated in one go.",
      ],
      link: { key: "contact", label: "Open the map and contact details" },
    },
    {
      id: "luu-y",
      h: "House rules and good-to-knows",
      p: [],
      items: [
        {
          name: "Guests 18 and over only",
          body: "Bring your national ID card or passport, as staff may check it at the door.",
        },
        { name: "Dress code", body: "LOCO's dress code is youthful and smart casual." },
        { name: "No outside food", body: "The club does not accept food or refreshments brought in from outside." },
        { name: "Opening hours", body: `LOCO is open ${site.hours.en}; book ahead if you plan to come on a weekend night.` },
      ],
      link: { key: "faq", label: "Read more frequently asked questions about LOCO" },
    },
    {
      id: "dip-phu-hop",
      h: "Which occasions suit LOCO?",
      p: [],
      items: [
        {
          name: "Birthdays and group parties",
          body: "The VIP Sofa in Heatroom takes up to 15 guests and SVIP on Floor 1 up to 12; mention it early so your group sits together.",
        },
        {
          name: "Theme nights with friends",
          body: "Watch for costume nights, FRIENDZONE or the New Year party for an evening that feels nothing like the usual.",
        },
        { name: "Hip-hop fans", body: "Floor 1 is dedicated entirely to Hip-hop and R&B." },
        { name: "EDM and House lovers", body: "Head up to Heatroom and stand near the DJ booth under the colour-shifting ceiling disc." },
      ],
    },
  ],
  call: "Call",
  zalo: "Zalo",
  bookPage: "Booking page",
  linksTitle: "Keep exploring",
  links: [
    { key: "menu", label: "LOCO Complex menu", sub: "5 pages, single view or flip-book" },
    { key: "gallery", label: "LOCO photo gallery", sub: "Heatroom, the Hip-hop floor, theme nights" },
    { key: "faq", label: "Frequently asked questions", sub: "Hours, booking, dress code" },
    { key: "book", label: "Book a table at LOCO", sub: "Booking form, hotline, Zalo" },
  ],
  alts: [
    "The LOCO Heatroom ceiling disc glowing aqua, rings of light above a dancing crowd",
    "The Heatroom floor in red with giant red spheres, seen from behind the DJ decks",
    "Inflatable orange mascot heads and round lanterns above the crowd at LOCO Heatroom",
    "A guest artist performing with a mic under the Heatroom ceiling disc, guests filming on phones",
    "A group of guests taking a selfie with the DJ beside the decks at LOCO Heatroom",
    "The “LOCO is on fire” theme night with performers dressed as firefighters holding a warning sign",
    "Guests dancing under the purple-lit ceiling disc at LOCO Heatroom",
    "The MC holding a Happy New Year 2026 sign at the LOCO Complex New Year party",
  ],
};
