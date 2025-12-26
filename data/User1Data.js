/* =========================================
   DỮ LIỆU NGƯỜI DÙNG (USER DATA)
   Lưu trữ danh sách sách cá nhân, trạng thái mượn/trả
   ========================================= */

const myCollection = [
    // --- SÁCH ĐANG MƯỢN ---
    {
        bookId: "ACT1", // Đấu trường sinh tử
        status: "borrowed",
        dateAdded: "20/12/2025",
        dueDate: "27/12/2025"
    },
    {
        bookId: "ROM1", // Kiêu hãnh và Định kiến
        status: "borrowed",
        dateAdded: "24/12/2025",
        dueDate: "31/12/2025"
    },
    
    // --- SÁCH ĐÃ MUA ---
    {
        bookId: "LIT2", // Nhà giả kim
        status: "bought",
        dateAdded: "15/10/2025",
        dueDate: null
    },
    {
        bookId: "KID2", // Dế Mèn phiêu lưu ký
        status: "bought",
        dateAdded: "01/06/2025",
        dueDate: null
    },
    {
        bookId: "HIS5", // Đại Việt sử ký toàn thư
        status: "bought",
        dateAdded: "02/09/2025",
        dueDate: null
    },

    // --- DANH SÁCH MONG MUỐN (WISHLIST) ---
    {
        bookId: "SCI1", // Xứ Cát (Dune)
        status: "wishlist",
        dateAdded: "26/12/2025",
        dueDate: null
    },
    {
        bookId: "NOV2", // Bố già
        status: "wishlist",
        dateAdded: "10/12/2025",
        dueDate: null
    },
    {
        bookId: "ACT6", // Sherlock Holmes
        status: "wishlist",
        dateAdded: "22/12/2025",
        dueDate: null
    }
];