// script/booksData.js
const books = [
    // --- HÀNH ĐỘNG (Action) ---
    {
        id: "ACT1",
        title: "Đấu trường sinh tử (The Hunger Games)",
        author: "Suzanne Collins",
        image: "../../images/action_1.jpg",
        genre: "Hành động",
        rating: 4.8,
        stock: 20,
        desc: "Trong một tương lai đen tối, Katniss Everdeen tình nguyện tham gia Đấu trường Sinh tử thay cho em gái mình...",
        views: 12547
    },
    {
        id: "ACT2",
        title: "Dị biệt (Divergent)",
        author: "Veronica Roth",
        image: "../../images/action_2.webp",
        genre: "Hành động",
        rating: 4.5,
        stock: 15,
        desc: "Xã hội được chia thành 5 môn phái. Tris Prior phát hiện mình là kẻ Dị biệt và không thuộc về bất cứ đâu...",
        views: 8923
    },
    {
        id: "ACT3",
        title: "Giải mã mê cung (The Maze Runner)",
        author: "James Dashner",
        image: "../../images/action_3.webp",
        genre: "Hành động",
        rating: 4.6,
        stock: 10,
        desc: "Thomas tỉnh dậy trong một thang máy và không nhớ gì ngoài tên mình, cậu bị đưa đến một mê cung khổng lồ...",
        views: 9215
    },
    {
        id: "ACT5",
        title: "Mật mã Da Vinci",
        author: "Dan Brown",
        image: "../../images/action_5.webp",
        genre: "Hành động",
        rating: 4.6,
        stock: 8,
        desc: "Một vụ án mạng tại bảo tàng Louvre dẫn đến những bí mật tôn giáo chấn động đã bị che giấu hàng nghìn năm...",
        views: 11203
    },
    {
        id: "ACT6",
        title: "Sherlock Holmes Toàn Tập",
        author: "Arthur Conan Doyle",
        image: "../../images/action_6.webp",
        genre: "Hành động",
        rating: 4.9,
        stock: 30,
        desc: "Tuyển tập những vụ án ly kỳ và tư duy logic siêu phàm của vị thám tử lừng danh nhất thế giới...",
        views: 22011
    },

    // --- KHOA HỌC VIỄN TƯỞNG (Sci-Fi) ---
    {
        id: "SCI1",
        title: "Xứ Cát (Dune)",
        author: "Frank Herbert",
        image: "../../images/scifi_1.webp",
        genre: "Khoa học viễn tưởng",
        rating: 4.9,
        stock: 12,
        desc: "Câu chuyện về Paul Atreides và cuộc chiến giành quyền kiểm soát hành tinh sa mạc Arrakis, nguồn hương dược duy nhất...",
        views: 14567
    },
  
    {
        id: "SCI3",
        title: "Tam Thể (The Three-Body Problem)",
        author: "Lưu Từ Hân",
        image: "../../images/scifi_3.webp",
        genre: "Khoa học viễn tưởng",
        rating: 4.7,
        stock: 10,
        desc: "Tiếp xúc đầu tiên của nhân loại với nền văn minh ngoài hành tinh Trisolaris mang đến nguy cơ diệt vong...",
        views: 9833
    },
    {
        id: "SCI4",
        title: "451 Độ F",
        author: "Ray Bradbury",
        image: "../../images/scifi_4.jpg",
        genre: "Khoa học viễn tưởng",
        rating: 4.5,
        stock: 22,
        desc: "Trong một tương lai nơi sách bị cấm và bị đốt cháy, Guy Montag - một lính phóng hỏa - bắt đầu nghi ngờ công việc của mình...",
        views: 7549
    },
    {
        id: "SCI5",
        title: "Cỗ máy thời gian",
        author: "H.G. Wells",
        image: "../../images/scifi_5.webp",
        genre: "Khoa học viễn tưởng",
        rating: 4.4,
        stock: 5,
        desc: "Nhà du hành thời gian đi đến tương lai năm 802.701 và chứng kiến số phận kỳ lạ của nhân loại...",
        views: 6021
    },
    {
        id: "SCI6",
        title: "1984",
        author: "George Orwell",
        image: "../../images/scifi_6.jpg",
        genre: "Khoa học viễn tưởng",
        rating: 4.9,
        stock: 40,
        desc: "Một cái nhìn ám ảnh về xã hội toàn trị, nơi mọi hành động và suy nghĩ đều bị giám sát bởi Big Brother...",
        views: 25103
    },

    // --- LÃNG MẠN (Romance) ---
    {
        id: "ROM1",
        title: "Kiêu hãnh và Định kiến",
        author: "Jane Austen",
        image: "../../images/romance_1.webp",
        genre: "Lãng mạn",
        rating: 4.9,
        stock: 30,
        desc: "Câu chuyện tình yêu kinh điển giữa Elizabeth Bennet thông minh và quý ngài Darcy kiêu ngạo...",
        views: 28451
    },
    {
        id: "ROM2",
        title: "Trước ngày em đến (Me Before You)",
        author: "Jojo Moyes",
        image: "../../images/romance_2.webp",
        genre: "Lãng mạn",
        rating: 4.7,
        stock: 14,
        desc: "Louisa Clark trở thành người chăm sóc cho Will Traynor, một chàng trai giàu có bị liệt nửa người...",
        views: 13077
    },
    {
        id: "ROM3",
        title: "Nhật ký tình yêu (The Notebook)",
        author: "Nicholas Sparks",
        image: "../../images/romance_3.webp",
        genre: "Lãng mạn",
        rating: 4.8,
        stock: 10,
        desc: "Câu chuyện tình yêu bền bỉ qua năm tháng của Noah và Allie, bất chấp khoảng cách xã hội và bệnh tật...",
        views: 11529
    },
    {
        id: "ROM4",
        title: "Rừng Na Uy",
        author: "Haruki Murakami",
        image: "../../images/romance_4.webp",
        genre: "Lãng mạn",
        rating: 4.6,
        stock: 16,
        desc: "Toru Watanabe hồi tưởng lại những ngày tháng sinh viên và mối tình với Naoko, người con gái mang nhiều tổn thương...",
        views: 16213
    },
    {
        id: "ROM5",
        title: "Gọi em bằng tên anh",
        author: "André Aciman",
        image: "../../images/romance_5.webp",
        genre: "Lãng mạn",
        rating: 4.5,
        stock: 9,
        desc: "Câu chuyện tình mùa hè đầy lãng mạn và day dứt giữa Elio và Oliver tại vùng quê nước Ý...",
        views: 9547
    },
    {
        id: "ROM6",
        title: "Cuốn theo chiều gió",
        author: "Margaret Mitchell",
        image: "../../images/romance_6.webp",
        genre: "Lãng mạn",
        rating: 4.8,
        stock: 12,
        desc: "Câu chuyện về Scarlett O'Hara mạnh mẽ và kiên cường giữa bối cảnh Nội chiến Mỹ đầy biến động...",
        views: 19083
    },

    // --- LỊCH SỬ (History) ---
    {
        id: "HIS1",
        title: "Sapiens: Lược sử loài người",
        author: "Yuval Noah Harari",
        image: "../../images/history_1.webp",
        genre: "Lịch sử",
        rating: 4.9,
        stock: 50,
        desc: "Cuốn sách bao quát lịch sử tiến hóa của loài người từ thời kỳ đồ đá cho đến thế kỷ 21...",
        views: 45129
    },
    {
        id: "HIS2",
        title: "Kẻ trộm sách (The Book Thief)",
        author: "Markus Zusak",
        image: "../../images/history_2.webp",
        genre: "Lịch sử",
        rating: 4.8,
        stock: 12,
        desc: "Câu chuyện về cô bé Liesel Meminger sống tại Đức trong Thế chiến thứ II và niềm đam mê với những cuốn sách...",
        views: 12843
    },
    {
        id: "HIS3",
        title: "Súng, Vi trùng và Thép",
        author: "Jared Diamond",
        image: "../../images/history_3.webp",
        genre: "Lịch sử",
        rating: 4.7,
        stock: 20,
        desc: "Giải thích lý do tại sao các nền văn minh Á-Âu lại tồn tại và chinh phục được các nền văn minh khác...",
        views: 8561
    },
    {
        id: "HIS4",
        title: "Ánh sáng vô hình",
        author: "Anthony Doerr",
        image: "../../images/history_4.webp",
        genre: "Lịch sử",
        rating: 4.8,
        stock: 8,
        desc: "Hai câu chuyện song song của một cô gái mù người Pháp và một chàng lính Đức trẻ tuổi trong Thế chiến II...",
        views: 9017
    },
    {
        id: "HIS5",
        title: "Đại Việt sử ký toàn thư",
        author: "Ngô Sĩ Liên",
        image: "../../images/history_5.webp",
        genre: "Lịch sử",
        rating: 5.0,
        stock: 5,
        desc: "Bộ chính sử lớn và quan trọng nhất của Việt Nam, ghi chép lịch sử từ thời Hồng Bàng đến nhà Hậu Lê...",
        views: 5231
    },
    {
        id: "HIS6",
        title: "Những con đường tơ lụa",
        author: "Peter Frankopan",
        image: "../../images/history_6.webp",
        genre: "Lịch sử",
        rating: 4.7,
        stock: 15,
        desc: "Một lịch sử mới về thế giới, tập trung vào phương Đông và những con đường kết nối thương mại...",
        views: 7359
    },

    // --- TIỂU THUYẾT (Novel) ---
    {
        id: "NOV1",
        title: "Giết con chim nhại",
        author: "Harper Lee",
        image: "../../images/novel_1.webp",
        genre: "Tiểu thuyết",
        rating: 4.9,
        stock: 25,
        desc: "Qua ánh mắt của cô bé Scout, cuốn sách lên án nạn phân biệt chủng tộc và đề cao lòng dũng cảm...",
        views: 22107
    },
    {
        id: "NOV2",
        title: "Bố già (The Godfather)",
        author: "Mario Puzo",
        image: "../../images/novel_2.webp",
        genre: "Tiểu thuyết",
        rating: 4.9,
        stock: 18,
        desc: "Câu chuyện kinh điển về gia đình Mafia Corleone, về quyền lực, danh dự và sự trả thù...",
        views: 19563
    },
    {
        id: "NOV3",
        title: "Người đua diều",
        author: "Khaled Hosseini",
        image: "../../images/novel_3.webp",
        genre: "Tiểu thuyết",
        rating: 4.8,
        stock: 15,
        desc: "Tình bạn đầy ám ảnh giữa Amir và Hassan, cùng hành trình chuộc lỗi kéo dài hàng thập kỷ...",
        views: 15589
    },
    {
        id: "NOV4",
        title: "Đại gia Gatsby",
        author: "F. Scott Fitzgerald",
        image: "../../images/novel_4.webp",
        genre: "Tiểu thuyết",
        rating: 4.5,
        stock: 20,
        desc: "Bức tranh về Giấc mơ Mỹ sụp đổ qua cuộc đời hào nhoáng nhưng bi kịch của Jay Gatsby...",
        views: 21041
    },
    {
        id: "NOV5",
        title: "Trăm năm cô đơn",
        author: "Gabriel García Márquez",
        image: "../../images/novel_5.webp",
        genre: "Tiểu thuyết",
        rating: 4.7,
        stock: 10,
        desc: "Saga gia đình Buendía qua bảy thế hệ tại ngôi làng Macondo hư cấu, pha trộn giữa hiện thực và huyền ảo...",
        views: 13573
    },
    {
        id: "NOV6",
        title: "Đôn Ki-hô-tê",
        author: "Miguel de Cervantes",
        image: "../../images/novel_6.webp",
        genre: "Tiểu thuyết",
        rating: 4.6,
        stock: 8,
        desc: "Câu chuyện hài hước và châm biếm về chàng hiệp sĩ hoang tưởng Đôn Ki-hô-tê và giám mã Sancho Panza...",
        views: 10519
    },

    // --- THIẾU NHI (Children) ---
    {
        id: "KID1",
        title: "Hoàng tử bé",
        author: "Antoine de Saint-Exupéry",
        image: "../../images/children_1.jpg",
        genre: "Thiếu nhi",
        rating: 5.0,
        stock: 40,
        desc: "Câu chuyện thơ mộng và triết lý về một hoàng tử nhỏ đến từ tiểu tinh cầu xa xôi...",
        views: 35121
    },
    {
        id: "KID2",
        title: "Dế Mèn phiêu lưu ký",
        author: "Tô Hoài",
        image: "../../images/children_2.jpg",
        genre: "Thiếu nhi",
        rating: 4.9,
        stock: 35,
        desc: "Cuộc phiêu lưu của chú Dế Mèn đi qua nhiều vùng đất, học được nhiều bài học về tình bạn và đường đời...",
        views: 42309
    },
    {
        id: "KID3",
        title: "Kính Vạn Hoa Thiên Nhiên - Chim Sẻ Vô Tội",
        author: "Nguyễn Nhật Ánh",
        image: "../../images/children_3.webp",
        genre: "Thiếu nhi",
        rating: 4.8,
        stock: 28,
        desc: "NVương quốc Ruộng Đồng lúc nào cũng có những vụ mùa bội thu, nhưng quốc vương lại nghĩ nếu không có đám chim sẻ ăn thóc trên cánh đồng thì ắt hẳn vương quốc sẽ còn gặt hái được nhiều hoa màu hơn nữa! Những con chim sẻ sẽ bị đuổi khỏi vương quốc Ruộng Đồng sao?",
        views: 31087
    },
    {
        id: "KID4",
        title: "Charlie và nhà máy sô-cô-la",
        author: "Roald Dahl",
        image: "../../images/children_4.webp",
        genre: "Thiếu nhi",
        rating: 4.7,
        stock: 15,
        desc: "Cậu bé nghèo Charlie Bucket tìm được chiếc vé vàng may mắn để tham quan nhà máy sô-cô-la kỳ diệu của Willy Wonka...",
        views: 18053
    },
    {
        id: "KID5",
        title: "Nhật ký chú bé nhút nhát",
        author: "Jeff Kinney",
        image: "../../images/children_5.webp",
        genre: "Thiếu nhi",
        rating: 4.6,
        stock: 50,
        desc: "Những ghi chép hài hước về cuộc sống học đường và gia đình của cậu bé Greg Heffley...",
        views: 28143
    },
    {
        id: "KID6",
        title: "Pippi Tất Dài",
        author: "Astrid Lindgren",
        image: "../../images/children_6.webp",
        genre: "Thiếu nhi",
        rating: 4.7,
        stock: 20,
        desc: "Cô bé Pippi tóc đỏ, mặt đầy tàn nhang với sức mạnh phi thường sống một mình ở biệt thự Bát Nháo...",
        views: 14099
    },

    // --- VĂN HỌC (Literature) ---
    {
        id: "LIT1",
        title: "Chúa tể những chiếc nhẫn",
        author: "J.R.R. Tolkien",
        image: "../../images/lit_1.webp",
        genre: "Văn học",
        rating: 5.0,
        stock: 10,
        desc: "Hành trình vĩ đại của Frodo Baggins để tiêu hủy Chiếc nhẫn Quyền lực và cứu Trung Địa khỏi bóng tối...",
        views: 29157
    },
    {
        id: "LIT2",
        title: "Nhà giả kim",
        author: "Paulo Coelho",
        image: "../../images/lit_2.webp",
        genre: "Văn học",
        rating: 4.8,
        stock: 60,
        desc: "Hành trình theo đuổi vận mệnh của chàng chăn cừu Santiago, tìm kiếm kho báu ở Kim Tự Tháp...",
        views: 45671
    },
    {
        id: "LIT3",
        title: "Tắt đèn",
        author: "Ngô Tất Tố",
        image: "../../images/lit_3.webp",
        genre: "Văn học",
        rating: 4.9,
        stock: 20,
        desc: "Bức tranh chân thực và đau lòng về cuộc sống khốn cùng của người nông dân Việt Nam dưới chế độ thực dân phong kiến...",
        views: 12103
    },
    {
        id: "LIT4",
        title: "Số đỏ",
        author: "Vũ Trọng Phụng",
        image: "../../images/lit_4.webp",
        genre: "Văn học",
        rating: 4.8,
        stock: 25,
        desc: "Tiểu thuyết trào phúng đả kích thói rởm đời của tầng lớp tư sản thành thị Việt Nam thời Pháp thuộc...",
        views: 14089
    },
    {
        id: "LIT5",
        title: "Những người khốn khổ",
        author: "Victor Hugo",
        image: "../../images/lit_5.webp",
        genre: "Văn học",
        rating: 4.9,
        stock: 12,
        desc: "Câu chuyện bi tráng về Jean Valjean, Fantine, Cosette và bối cảnh xã hội nước Pháp thế kỷ 19...",
        views: 17543
    },
    {
        id: "LIT6",
        title: "Chiến tranh và Hòa bình",
        author: "Lev Tolstoy",
        image: "../../images/lit_6.webp",
        genre: "Văn học",
        rating: 4.8,
        stock: 7,
        desc: "Bức tranh toàn cảnh về nước Nga giai đoạn chiến tranh Napoleon, đan xen giữa lịch sử và những số phận con người...",
        views: 8527
    }
];