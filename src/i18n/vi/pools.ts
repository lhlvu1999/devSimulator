import type { Pattern, Translate } from "./index";

/**
 * Vietnamese for the mini-game content pools. The pools are built from a few
 * hundred base lines plus generated variations ("Urgent: …", "(v2)", "— lite").
 * Base lines live in VI_POOLS; the variations are rebuilt by VI_POOL_PATTERNS.
 */

// Inbox: senders and base messages
const INBOX: Record<string, string> = {
  Support: "CSKH",
  Ops: "Vận hành",
  "Shop team": "Team cửa hàng",
  Sales: "Sales",
  Security: "Bảo mật",
  Delivery: "Giao hàng",
  Team: "Team",
  Marketing: "Marketing",
  HR: "HR",
  CEO: "CEO",
  Office: "Văn phòng",
  "Customers can't pay at checkout.": "Khách hàng không thanh toán được.",
  "The app won't open on some phones.":
    "App không mở được trên một số điện thoại.",
  "Nobody can log in right now.": "Hiện không ai đăng nhập được.",
  "The shop shows the wrong price.": "Cửa hàng hiển thị sai giá.",
  "New orders are not arriving.": "Đơn hàng mới không về.",
  "Password reset emails never arrive.":
    "Email đặt lại mật khẩu không bao giờ tới.",
  "A customer was charged twice.": "Một khách hàng bị trừ tiền hai lần.",
  "The home page is completely blank.": "Trang chủ trắng trơn.",
  "Carts empty themselves at random.": "Giỏ hàng tự dưng bị xóa sạch.",
  "Search shows nothing for every word.": "Tìm từ nào cũng không ra kết quả.",
  "Other people's orders are visible.": "Nhìn thấy cả đơn hàng của người khác.",
  "The sign-up button does nothing.": "Nút đăng ký bấm không có tác dụng.",
  "Refunds are stuck for everyone.": "Hoàn tiền bị kẹt với tất cả mọi người.",
  "Drivers can't see the delivery map.":
    "Tài xế không xem được bản đồ giao hàng.",
  "Could the logo be a little bigger?": "Logo to hơn chút được không?",
  "Let's try a new font in the footer.": "Thử font mới cho footer nhé.",
  "Rename 'Settings' to 'Preferences'.": "Đổi tên 'Cài đặt' thành 'Tùy chọn'.",
  "Dark mode would be nice someday.": "Khi nào có dark mode thì hay.",
  "Who's in for team lunch Friday?": "Ai đi ăn trưa cùng team thứ Sáu nào?",
  "Tidy the old photos in the folder.": "Dọn ảnh cũ trong thư mục.",
  "The icons could be a bit rounder.": "Icon có thể bo tròn hơn chút.",
  "Please fill in the happiness survey.":
    "Mọi người điền khảo sát mức độ hài lòng nhé.",
  "What if the app had a mascot?": "Hay là app có một linh vật?",
  "The old docs could use a cleanup.": "Tài liệu cũ nên được dọn dẹp.",
  "Add a party emoji to the welcome email.":
    "Thêm emoji pháo hoa vào email chào mừng.",
  "New desks arrive next month.": "Tháng sau bàn mới về.",
  "Maybe the footer should be green?": "Hay footer nên màu xanh lá?",
  "Let's add a badge for 100 orders.":
    "Thêm huy hiệu cho mốc 100 đơn hàng nhé.",
  "Payments fail on Safari.": "Thanh toán lỗi trên Safari.",
  "Images upload as blank squares.": "Ảnh tải lên thành ô trống.",
  "Two-factor codes never send.": "Mã xác thực hai lớp không bao giờ gửi đi.",
  "The API returns 500 for everyone.":
    "API trả về lỗi 500 với tất cả mọi người.",
  "Mobile push alerts stopped.": "Thông báo đẩy trên mobile ngừng hoạt động.",
  "Gift cards show $NaN.": "Thẻ quà tặng hiển thị $NaN.",
  "Users see someone else's name.": "Người dùng thấy tên của người khác.",
  "Checkout spinner never ends.": "Vòng xoay thanh toán quay mãi không dừng.",
  "Tax is calculated at 900%.": "Thuế bị tính 900%.",
  "Admin panel is wide open.": "Trang admin bị mở toang.",
  "Database backup failed overnight.": "Sao lưu database thất bại trong đêm.",
  "Webhooks fire twice each time.": "Webhook bị bắn hai lần mỗi lượt.",
  "Session cookies expire in one second.": "Cookie phiên hết hạn sau một giây.",
  "PDF invoices are empty.": "Hóa đơn PDF trống trơn.",
  "Voice login always fails.": "Đăng nhập bằng giọng nói luôn thất bại.",
  "Shipping labels print upside down.": "Nhãn vận chuyển in bị ngược.",
  "Coupon stack breaks totals.": "Dùng nhiều mã giảm giá làm sai tổng tiền.",
  "Live chat shows offline.": "Chat trực tuyến báo offline.",
  "Profile photos won't save.": "Ảnh đại diện không lưu được.",
  "Calendar sync deletes events.": "Đồng bộ lịch làm xóa sự kiện.",
  "Stripe webhook signature mismatch.": "Chữ ký webhook Stripe không khớp.",
  "Android app crashes on launch.": "App Android crash khi khởi động.",
  "iOS keyboard covers checkout.": "Bàn phím iOS che mất trang thanh toán.",
  "Warehouse scanner API is down.": "API máy quét kho bị sập.",
  "Inventory counts show negative stock.": "Số lượng tồn kho bị âm.",
  "Email domain blocklisted.": "Tên miền email bị đưa vào danh sách chặn.",
  "Rate limiter blocks all traffic.": "Rate limiter chặn toàn bộ truy cập.",
  "CDN serves stale JavaScript bundle.": "CDN trả về bundle JavaScript cũ.",
  "Feature flag stuck on for everyone.":
    "Feature flag bị kẹt ở trạng thái bật cho mọi người.",
  "Support macros insert wrong customer name.":
    "Macro CSKH chèn sai tên khách hàng.",
  "Billing cycle charged annual by mistake.":
    "Chu kỳ thanh toán bị tính theo năm do nhầm lẫn.",
  "Maps pin drops in wrong country.": "Ghim bản đồ rơi nhầm quốc gia.",
  "Video calls drop after ten seconds.":
    "Cuộc gọi video bị ngắt sau mười giây.",
  "Export CSV is empty for admins.": "File CSV xuất ra trống với admin.",
  "Audit log stopped writing entries.": "Audit log ngừng ghi nhận.",
  "Partner API keys expired globally.":
    "API key của đối tác hết hạn trên toàn hệ thống.",
  "Slack alerts stopped posting.": "Cảnh báo Slack ngừng gửi.",
  "Status page shows all green while down.":
    "Trang trạng thái toàn màu xanh trong khi hệ thống đang sập.",
  "Load balancer health checks fail.":
    "Health check của load balancer thất bại.",
  "Kubernetes pods crash loop on deploy.":
    "Pod Kubernetes crash liên tục khi deploy.",
  "Refresh the careers page copy.": "Làm mới nội dung trang tuyển dụng.",
  "Try a softer button shadow.": "Thử bóng nút nhẹ nhàng hơn.",
  "Sort the FAQ alphabetically.": "Sắp xếp FAQ theo bảng chữ cái.",
  "Add tooltips to the settings page.": "Thêm tooltip cho trang cài đặt.",
  "Print new welcome stickers.": "In sticker chào mừng mới.",
  "Organize the asset library.": "Sắp xếp thư viện tài nguyên.",
  "Sketch a holiday banner.": "Phác thảo banner ngày lễ.",
  "Update the team org chart.": "Cập nhật sơ đồ tổ chức của team.",
  "Collect quotes for a case study.": "Thu thập trích dẫn cho một case study.",
  "Plan a lunch-and-learn.": "Lên kế hoạch buổi vừa ăn trưa vừa học.",
  "Rewrite the release notes template.": "Viết lại mẫu release notes.",
  "Archive old sprint boards.": "Lưu trữ các bảng sprint cũ.",
  "Pick a playlist for the office.": "Chọn playlist cho văn phòng.",
  "Draft a blog about our stack.": "Viết nháp blog về tech stack của mình.",
  "Color-code the wiki tags.": "Gắn màu cho tag trên wiki.",
  "Prototype a sticker pack.": "Làm bản thử bộ sticker.",
  "Review competitor onboarding.": "Xem lại onboarding của đối thủ.",
  "Schedule photo day.": "Lên lịch ngày chụp ảnh.",
  "Clean up unused feature flags.": "Dọn các feature flag không dùng.",
  "Brainstorm swag ideas.": "Brainstorm ý tưởng quà tặng công ty.",
  "Add alt text to marketing images.": "Thêm alt text cho ảnh marketing.",
  "Standardize error message tone.": "Thống nhất giọng văn thông báo lỗi.",
  "Try a new favicon sketch.": "Thử phác thảo favicon mới.",
  "Document the on-call runbook.": "Viết tài liệu runbook on-call.",
  "Refresh open-source attributions.": "Cập nhật ghi công mã nguồn mở.",
  "Tune notification defaults.": "Chỉnh lại cài đặt thông báo mặc định.",
  "Collect UX feedback on settings.": "Thu thập góp ý UX về trang cài đặt.",
  "Plan an intern project.": "Lên kế hoạch dự án cho intern.",
  "Update desk booking instructions.": "Cập nhật hướng dẫn đặt chỗ ngồi.",
  "Review vendor contracts renewal.":
    "Xem lại việc gia hạn hợp đồng nhà cung cấp.",
  "Create a template for postmortems.": "Tạo mẫu cho post-mortem.",
  "Sort design tokens file.": "Sắp xếp file design token.",
  "Add screenshots to internal wiki.":
    "Thêm ảnh chụp màn hình vào wiki nội bộ.",
  "Schedule a demo day slot.": "Đặt lịch một suất demo day.",
  "Draft values poster copy.": "Viết nháp nội dung poster giá trị cốt lõi.",
  "Organize customer interview notes.": "Sắp xếp ghi chú phỏng vấn khách hàng.",
  "Try a softer hero gradient.": "Thử gradient hero nhẹ nhàng hơn.",
  "Audit third-party scripts.": "Rà soát các script bên thứ ba.",
  "Plan volunteer day signup.": "Lên kế hoạch đăng ký ngày tình nguyện.",
  "Collect team book recommendations.": "Thu thập sách hay team gợi ý.",
};

/** "Urgent: …" and other lead-ins on inbox messages and 1:1 talks. */
const LEAD: Record<string, string> = {
  Urgent: "Khẩn",
  Escalated: "Đã báo lên cấp trên",
  "Customer report": "Khách hàng báo",
  "On-call ping": "On-call gọi",
  "Blocking release": "Chặn release",
  "Needs fix today": "Cần sửa trong hôm nay",
  "Hot issue": "Vấn đề nóng",
  "Again today": "Hôm nay lại bị",
  "Pager duty": "Trực sự cố",
  "SEV-1": "SEV-1",
  Reopened: "Mở lại",
  "Still broken": "Vẫn hỏng",
  "Reported twice": "Bị báo hai lần",
  "CEO asked about": "CEO hỏi về",
  "Revenue impact": "Ảnh hưởng doanh thu",
  "All hands note": "Ghi chú họp toàn công ty",
  "QA blocked": "QA bị chặn",
  "Release gate": "Cổng release",
  "When you have time": "Khi nào rảnh",
  "Low priority": "Ưu tiên thấp",
  "Nice to have": "Có thì tốt",
  "Backlog idea": "Ý tưởng cho backlog",
  "No rush": "Không gấp",
  "For later": "Để sau",
  "Thought for Q4": "Ý tưởng cho Q4",
  "Side note": "Ghi chú thêm",
  "Maybe someday": "Có lẽ một ngày nào đó",
  "Parking lot": "Tạm gác lại",
  Icebox: "Đóng băng",
  "After launch": "Sau khi ra mắt",
  "Polish pass": "Đợt chau chuốt",
  "Culture idea": "Ý tưởng văn hóa",
  "Docs task": "Việc tài liệu",
  "Design debt": "Nợ thiết kế",
  Optional: "Không bắt buộc",
  "Future sprint": "Sprint sau này",
  Idea: "Ý tưởng",
  "Someday/maybe": "Một ngày nào đó",
  "Quick check-in": "Hỏi nhanh",
  "1:1 note": "Ghi chú 1:1",
  "Heads up": "Báo trước",
  "Between us": "Nói riêng nhé",
  "Small thing": "Chuyện nhỏ thôi",
};

/** Lead-ins that end with a comma or a question rather than a colon. */
const OPENER: readonly [string, string][] = [
  ["Honestly, ", "Thật lòng mà nói, "],
  ["Not sure how to say this, but ", "Không biết nói sao, nhưng "],
  ["Sorry to bother you, but ", "Xin lỗi làm phiền, nhưng "],
  ["Can we talk? ", "Mình nói chuyện chút được không? "],
];

/** Tails added to a 1:1 line, before the final period. */
const TAIL: Record<string, string> = {
  ", and it's wearing on me": ", và nó làm mình mệt mỏi",
  " before the deadline": " trước deadline",
  " and I'm not sure what to do": " và mình không biết phải làm sao",
  " for a while now": " cũng được một thời gian rồi",
};

const ASK: Record<string, string> = {
  "any advice?": "có lời khuyên nào không?",
  "wanted your take.": "muốn nghe ý kiến của bạn.",
  "could use guidance.": "cần được chỉ dẫn.",
  "mind if we discuss?": "mình bàn chút được không?",
  "your call?": "bạn quyết nhé?",
};

// 1:1 talks
const TALKS: Record<string, string> = {
  "I'm drowning in tickets this week.": "Tuần này mình ngập trong ticket.",
  "Let's move two of them to next week.": "Mình dời hai cái sang tuần sau nhé.",
  "I've done the same fix ten times now.":
    "Mình đã sửa cùng một lỗi mười lần rồi.",
  "Want to try the new payment feature?":
    "Bạn muốn thử làm tính năng thanh toán mới không?",
  "I shipped the login page!": "Mình đã ship trang đăng nhập rồi!",
  "Nice work. Show it at the team demo.":
    "Làm tốt lắm. Đem ra khoe ở buổi demo của team nhé.",
  "I can't figure out this bug.": "Mình không tìm ra bug này.",
  "Let's look at it together for twenty minutes.":
    "Mình cùng xem trong hai mươi phút nhé.",
  "I stayed late three nights in a row.": "Mình đã ở lại muộn ba tối liền.",
  "Take tomorrow morning off.": "Sáng mai bạn nghỉ đi.",
  "Am I doing okay here?": "Mình làm có ổn không?",
  "Yes. Here's what you did well this month.":
    "Ổn chứ. Đây là những gì bạn làm tốt tháng này.",
  "Someone keeps changing my work without asking.":
    "Có người cứ sửa việc của mình mà không hỏi.",
  "Let's all agree on a plan together.":
    "Mọi người cùng thống nhất một kế hoạch nhé.",
  "I got another job offer.": "Mình nhận được offer ở chỗ khác.",
  "Thanks for telling me. What would make you stay?":
    "Cảm ơn bạn đã nói. Điều gì sẽ giữ bạn ở lại?",
  "The launch date feels impossible.": "Ngày ra mắt có vẻ bất khả thi.",
  "Let's cut the plan down to what matters most.":
    "Mình cắt kế hoạch xuống còn những gì quan trọng nhất.",
  "Meetings take up my whole week.": "Họp hành chiếm hết cả tuần của mình.",
  "Let's drop the ones you don't need to be in.":
    "Bỏ bớt những cuộc họp bạn không cần dự nhé.",
  "A customer wrote to thank me!": "Một khách hàng viết thư cảm ơn mình!",
  "That's great. Share it with the whole team.":
    "Tuyệt quá. Chia sẻ với cả team đi.",
  "I don't understand the new tool.": "Mình không hiểu công cụ mới.",
  "Let's book an hour with someone who knows it.":
    "Đặt một tiếng với người rành nó nhé.",
  "My baby kept me up all night.": "Con mình quấy cả đêm.",
  "Take it easy today. Start late if you need to.":
    "Hôm nay cứ thong thả. Cần thì vào muộn cũng được.",
  "Should I try for a promotion?": "Mình có nên thử xin thăng chức không?",
  "Yes. Let's write down what you need together.":
    "Nên chứ. Mình cùng viết ra những gì bạn cần nhé.",
  "I wasn't invited to the big planning meeting.":
    "Mình không được mời vào buổi họp kế hoạch lớn.",
  "You should be there. I'll add you now.":
    "Bạn nên có mặt. Mình thêm bạn vào ngay.",
  "I'm thinking about moving to another team.":
    "Mình đang tính chuyển sang team khác.",
  "Let's talk about what you'd like to work on.":
    "Mình nói chuyện về việc bạn muốn làm nhé.",
  "Great, I'll add one more.": "Tuyệt, để mình thêm một cái nữa.",
  "Just work a bit faster.": "Làm nhanh hơn chút là được.",
  "That's just the job.": "Công việc là vậy mà.",
  "Take a longer lunch.": "Nghỉ trưa lâu hơn đi.",
  "Took you long enough.": "Lâu quá đấy.",
  "Okay. What's next?": "Ừ. Tiếp theo là gì?",
  "Figure it out yourself.": "Tự tìm cách đi.",
  "Just skip it.": "Bỏ qua đi.",
  "Keep it up!": "Cố lên!",
  "Everyone does that.": "Ai cũng thế mà.",
  "Hard to say.": "Khó nói lắm.",
  "Why do you ask?": "Sao lại hỏi vậy?",
  "Just ignore them.": "Kệ họ đi.",
  "Change their work back.": "Sửa lại việc của họ đi.",
  "Good luck, bye.": "Chúc may mắn, tạm biệt.",
  "You can't leave.": "Bạn không được đi.",
  "It's fine, just stay late.": "Không sao, ở lại muộn chút là được.",
  "Launches are always like that.": "Ra mắt lúc nào chẳng vậy.",
  "Meetings build character.": "Họp hành rèn luyện tính cách.",
  "Try to enjoy them more.": "Cố tận hưởng chúng hơn đi.",
  "Customers say lots of things.": "Khách hàng nói đủ thứ mà.",
  "Back to work, then.": "Vậy quay lại làm việc thôi.",
  "Read the manual again.": "Đọc lại hướng dẫn đi.",
  "Everyone else gets it.": "Người khác ai cũng hiểu mà.",
  "That's not a work problem.": "Đó đâu phải chuyện công việc.",
  "Coffee fixes that.": "Cà phê sẽ giải quyết được.",
  "Maybe in a few years.": "Có lẽ vài năm nữa.",
  "Why would you want that?": "Sao bạn lại muốn vậy?",
  "It wasn't that important.": "Cũng không quan trọng lắm.",
  "You're too busy anyway.": "Đằng nào bạn cũng quá bận.",
  "Do what you want.": "Muốn làm gì thì làm.",
  "No one leaves my team.": "Không ai được rời team của tôi.",
};

// Sprint tasks and roadmap features
const PLANNING: Record<string, string> = {
  "Checkout fix": "Sửa thanh toán",
  "New onboarding": "Onboarding mới",
  "Dark mode": "Dark mode",
  "Faster search": "Tìm kiếm nhanh hơn",
  "Update icons": "Cập nhật icon",
  "Refund button": "Nút hoàn tiền",
  "Email receipts": "Gửi hóa đơn qua email",
  "Bug bash": "Bug bash",
  "Clean old code": "Dọn code cũ",
  "Help page": "Trang trợ giúp",
  "Login with phone": "Đăng nhập bằng số điện thoại",
  "Order history": "Lịch sử đơn hàng",
  "Gift wrap option": "Tùy chọn gói quà",
  "Speed up photos": "Tăng tốc tải ảnh",
  "Coupon codes": "Mã giảm giá",
  "Push alerts": "Thông báo đẩy",
  "Accessibility pass": "Rà soát trợ năng",
  "Translate to French": "Dịch sang tiếng Pháp",
  "New pricing page": "Trang bảng giá mới",
  "Fix crash on start": "Sửa crash khi khởi động",
  "Saved carts": "Lưu giỏ hàng",
  "Team chat": "Chat nhóm",
  "Offline mode": "Chế độ offline",
  "New logo": "Logo mới",
  "Gift cards": "Thẻ quà tặng",
  "Price alerts": "Báo giá",
  "Voice search": "Tìm kiếm bằng giọng nói",
  "Photo filters": "Bộ lọc ảnh",
  "Referral bonus": "Thưởng giới thiệu",
  "Weekly report": "Báo cáo tuần",
  "One-tap reorder": "Đặt lại một chạm",
  "Birthday discount": "Giảm giá sinh nhật",
  "Smart watch app": "App đồng hồ thông minh",
  "Shared wishlists": "Danh sách mong muốn chung",
  "Live chat help": "Hỗ trợ chat trực tuyến",
  "3D product view": "Xem sản phẩm 3D",
  "Split payments": "Chia tiền thanh toán",
  "Loyalty points": "Điểm thành viên",
  "Night delivery": "Giao hàng ban đêm",
  "Recipe ideas": "Gợi ý công thức nấu ăn",
};

const SPRINT_TAG: Record<string, string> = {
  v2: "v2",
  polish: "chau chuốt",
  spike: "nghiên cứu",
  rollout: "triển khai",
  hotfix: "hotfix",
  cleanup: "dọn dẹp",
  metrics: "đo lường",
  tests: "test",
  docs: "tài liệu",
  beta: "beta",
  pilot: "thử nghiệm",
  audit: "rà soát",
  refactor: "refactor",
  monitoring: "giám sát",
  design: "thiết kế",
};

const FEATURE_TAG: Record<string, string> = {
  lite: "bản rút gọn",
  plus: "bản nâng cao",
  "for teams": "cho nhóm",
  mobile: "mobile",
  international: "quốc tế",
  automation: "tự động hóa",
  insights: "phân tích sâu",
  "self-serve": "tự phục vụ",
  API: "API",
  pilot: "thử nghiệm",
  enterprise: "doanh nghiệp",
  starter: "bản khởi đầu",
  pro: "bản pro",
  embedded: "nhúng",
  analytics: "analytics",
};

// Tidy the screen: the extra scenes
const TIDY: Record<string, string> = {
  Event: "Sự kiện",
  Reminder: "Nhắc nhở",
  "Wrong date": "Ngày sai",
  Sticker: "Sticker",
  "Invite card": "Thiệp mời",
  "Pin board": "Bảng ghim",
  "Heart rate": "Nhịp tim",
  "999999 steps": "999999 bước",
  "Water bottle": "Bình nước",
  Towel: "Khăn",
  Hook: "Móc treo",
  Chart: "Biểu đồ",
  Tomato: "Cà chua",
  "Water can": "Bình tưới",
  Weed: "Cỏ dại",
  Gnome: "Tượng chú lùn",
  "Seed packet": "Gói hạt giống",
  Plot: "Luống đất",
  Fence: "Hàng rào",
  Book: "Sách",
  Bookmark: "Dấu trang",
  "Coffee stain": "Vết cà phê",
  "Bookmark ribbon": "Dải dấu trang",
  "Return slip": "Phiếu trả sách",
  Shelf: "Kệ",
  Sign: "Biển hiệu",
  Gate: "Cửa ra máy bay",
  "Wrong gate": "Cửa ra sai",
  Suitcase: "Va li",
  "Boarding pass": "Thẻ lên máy bay",
  Tray: "Khay",
  Banner: "Banner",
  Pot: "Nồi",
  "Sponge in pot": "Miếng rửa bát trong nồi",
  Lid: "Nắp nồi",
  "Recipe card": "Thẻ công thức",
  Trivet: "Miếng lót nồi",
  Apron: "Tạp dề",
  Pencil: "Bút chì",
  "Doodle on test": "Hình vẽ nguệch ngoạc trên bài kiểm tra",
  Eraser: "Cục tẩy",
  Homework: "Bài tập về nhà",
  Board: "Bảng",
  Stethoscope: "Ống nghe",
  "Band-aid on screen": "Băng cá nhân trên màn hình",
  Thermometer: "Nhiệt kế",
  "Patient card": "Thẻ bệnh nhân",
  Slot: "Khe",
  Wall: "Bức tường",
  Camera: "Máy ảnh",
  Light: "Đèn",
  "Lens cap on": "Nắp ống kính còn đậy",
  Tripod: "Chân máy",
  "Memory card": "Thẻ nhớ",
  Bay: "Ngăn chứa",
  Backdrop: "Phông nền",
  Car: "Ô tô",
  Wrench: "Cờ lê",
  "Flat tire icon": "Biểu tượng xịt lốp",
  "Oil can": "Can dầu",
  "Key fob": "Chìa khóa điều khiển",
  Peg: "Móc",
  Door: "Cửa",
  Headline: "Tiêu đề",
  Byline: "Tên tác giả",
  "Typo in title": "Lỗi chính tả trong tiêu đề",
  "Coffee cup": "Cốc cà phê",
  "Photo credit": "Nguồn ảnh",
  Masthead: "Măng-sét báo",
  Mic: "Micro",
  Waveform: "Sóng âm",
  "Dog barking track": "Track chó sủa",
  Headphones: "Tai nghe",
  "Episode art": "Ảnh bìa tập",
  Cover: "Bìa",
  Income: "Thu nhập",
  Expense: "Chi tiêu",
  "Negative lunch fund": "Quỹ ăn trưa bị âm",
  Receipt: "Hóa đơn",
  "Savings jar": "Lọ tiết kiệm",
  Trail: "Đường mòn",
  Boots: "Giày leo núi",
  "Sign pointing wrong way": "Biển chỉ sai hướng",
  Flask: "Bình giữ nhiệt",
  "Map fold": "Tấm bản đồ gấp",
  Pocket: "Túi",
  Loaf: "Ổ bánh mì",
  Oven: "Lò nướng",
  "Raw dough on shelf": "Bột sống trên kệ",
  Whisk: "Cây đánh trứng",
  "Order slip": "Phiếu order",
  Counter: "Quầy",
  Stage: "Sân khấu",
  Curtain: "Rèm",
  "Spotlight on empty seat": "Đèn rọi vào ghế trống",
  Program: "Tờ chương trình",
  "Ticket stub": "Cuống vé",
  Seat: "Ghế",
  Plaque: "Biển ghi chú",
  Artifact: "Cổ vật",
  "Price tag on statue": "Nhãn giá trên bức tượng",
  Brochure: "Tờ giới thiệu",
  "Audio guide": "Máy thuyết minh",
  Stand: "Giá đỡ",
  Barn: "Chuồng trại",
  Tractor: "Máy kéo",
  "Chicken in cab": "Con gà trong ca-bin",
  "Hay bale": "Bó rơm",
  "Feed bag": "Bao thức ăn",
  Umbrella: "Ô che nắng",
  "Snow on sand": "Tuyết trên cát",
  Cooler: "Thùng giữ lạnh",
  "Sandcastle flag": "Cờ lâu đài cát",
  Pole: "Cột cờ",
  Inbox: "Hộp thư",
  Calendar: "Lịch",
  "Meeting at 3 AM": "Cuộc họp lúc 3 giờ sáng",
  Stapler: "Dập ghim",
  "Name plate": "Bảng tên",
  "Remove the wrong date.": "Bỏ ngày sai đi.",
  "Put the invite card in the pin board.": "Ghim thiệp mời lên bảng ghim.",
  "Remove the 999999 steps.": "Bỏ con số 999999 bước đi.",
  "Put the towel in the hook.": "Treo khăn lên móc.",
  "Remove the weed.": "Nhổ cỏ dại.",
  "Put the seed packet in the plot.": "Đặt gói hạt giống vào luống đất.",
  "Remove the coffee stain.": "Xóa vết cà phê.",
  "Put the return slip in the shelf.": "Đặt phiếu trả sách lên kệ.",
  "Remove the wrong gate.": "Bỏ cửa ra sai đi.",
  "Put the boarding pass in the tray.": "Đặt thẻ lên máy bay vào khay.",
  "Remove the sponge in pot.": "Lấy miếng rửa bát ra khỏi nồi.",
  "Put the recipe card in the trivet.": "Đặt thẻ công thức lên miếng lót nồi.",
  "Remove the doodle on test.": "Xóa hình vẽ trên bài kiểm tra.",
  "Put the homework in the tray.": "Đặt bài tập về nhà vào khay.",
  "Remove the band-aid on screen.": "Bóc băng cá nhân khỏi màn hình.",
  "Put the patient card in the slot.": "Cắm thẻ bệnh nhân vào khe.",
  "Remove the lens cap on.": "Tháo nắp ống kính ra.",
  "Put the memory card in the bay.": "Cắm thẻ nhớ vào ngăn chứa.",
  "Remove the flat tire icon.": "Bỏ biểu tượng xịt lốp đi.",
  "Put the key fob in the peg.": "Treo chìa khóa lên móc.",
  "Remove the typo in title.": "Sửa lỗi chính tả trong tiêu đề.",
  "Put the photo credit in the slot.": "Đặt nguồn ảnh vào đúng chỗ.",
  "Remove the dog barking track.": "Bỏ track chó sủa đi.",
  "Put the episode art in the cover.": "Đặt ảnh bìa tập vào ô bìa.",
  "Remove the negative lunch fund.": "Bỏ quỹ ăn trưa bị âm đi.",
  "Put the savings jar in the tray.": "Đặt lọ tiết kiệm vào khay.",
  "Remove the sign pointing wrong way.": "Bỏ biển chỉ sai hướng đi.",
  "Put the map fold in the pocket.": "Cất tấm bản đồ vào túi.",
  "Remove the raw dough on shelf.": "Dọn bột sống trên kệ đi.",
  "Put the order slip in the counter.": "Đặt phiếu order lên quầy.",
  "Remove the spotlight on empty seat.": "Tắt đèn rọi vào ghế trống.",
  "Put the ticket stub in the seat.": "Đặt cuống vé lên ghế.",
  "Remove the price tag on statue.": "Gỡ nhãn giá khỏi bức tượng.",
  "Put the audio guide in the stand.": "Đặt máy thuyết minh lên giá đỡ.",
  "Remove the chicken in cab.": "Đưa con gà ra khỏi ca-bin.",
  "Put the feed bag in the hook.": "Treo bao thức ăn lên móc.",
  "Remove the snow on sand.": "Dọn tuyết trên cát đi.",
  "Put the sandcastle flag in the pole.": "Gắn cờ lâu đài cát lên cột.",
  "Remove the meeting at 3 am.": "Hủy cuộc họp lúc 3 giờ sáng.",
  "Put the name plate in the desk.": "Đặt bảng tên lên bàn.",
  calendar: "lịch",
  fitness: "thể dục",
  garden: "khu vườn",
  library: "thư viện",
  airport: "sân bay",
  kitchen: "nhà bếp",
  classroom: "lớp học",
  clinic: "phòng khám",
  studio: "studio",
  garage: "gara",
  newsroom: "tòa soạn",
  podcast: "podcast",
  budget: "ngân sách",
  hiking: "leo núi",
  bakery: "tiệm bánh",
  theater: "nhà hát",
  museum: "bảo tàng",
  farm: "nông trại",
  beach: "bãi biển",
  office: "văn phòng",
  picnic: "dã ngoại",
  cinema: "rạp phim",
  camera: "máy ảnh",
  music: "âm nhạc",
  weather: "thời tiết",
  pets: "thú cưng",
  recipe: "công thức",
  chat: "chat",
  bank: "ngân hàng",
  maps: "bản đồ",
  shop: "cửa hàng",
  photo: "ảnh",
  pet: "thú cưng",
  cooking: "nấu ăn",
  hike: "leo núi",
  news: "tin tức",
  school: "trường học",
  travel: "du lịch",
};

/** Things a "Make the X blue." note can paint, as they read mid-sentence. */
const PAINT: Record<string, string> = {
  header: "header",
  chart: "biểu đồ",
  fence: "hàng rào",
  sign: "biển hiệu",
  banner: "banner",
  apron: "tạp dề",
  board: "bảng",
  wall: "bức tường",
  backdrop: "phông nền",
  door: "cửa",
  masthead: "măng-sét báo",
  player: "trình phát",
  sky: "bầu trời",
  bubble: "bong bóng chat",
  button: "nút",
  card: "thẻ",
  cloth: "tấm khăn",
  "route line": "đường lộ trình",
  tag: "nhãn",
  "top bar": "thanh trên cùng",
};

const COLOR: Record<string, string> = {
  white: "trắng",
  green: "xanh lá",
  orange: "cam",
  blue: "xanh dương",
};

export const VI_POOLS: Record<string, string> = {
  ...INBOX,
  ...TALKS,
  ...PLANNING,
  ...TIDY,
};

function upperFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/** The translation, or null if the dictionary doesn't know it. Patterns only succeed when every part does. */
function known(translate: Translate, text: string): string | null {
  return translate(text);
}

/** A base line that may have lost its final punctuation, as in "I'm drowning — any advice?". */
function baseLine(translate: Translate, stem: string): string | null {
  for (const ending of ["", ".", "!", "?"]) {
    const found = known(translate, upperFirst(stem) + ending);
    if (found) return found.replace(/[.!?]$/, "");
  }
  return null;
}

export const VI_POOL_PATTERNS: readonly Pattern[] = [
  [
    /^Still happening — (.+)$/,
    (m, translate) => {
      const body = known(translate, upperFirst(m[1] ?? ""));
      return body ? `Vẫn đang xảy ra — ${lowerFirst(body)}` : null;
    },
  ],
  [
        /^(1:1 note|[^:]{2,30}): (.+)$/,
    (m, translate) => {
      const lead = LEAD[m[1] ?? ""];
      const body = lead ? known(translate, upperFirst(m[2] ?? "")) : null;
      return lead && body ? `${lead}: ${lowerFirst(body)}` : null;
    },
  ],
  [
    /^(Honestly, |Not sure how to say this, but |Sorry to bother you, but |Can we talk\? )(.+)$/,
    (m, translate) => {
      const opener = OPENER.find(([en]) => en === m[1])?.[1];
      const body = known(translate, upperFirst(m[2] ?? ""));
      return opener && body ? `${opener}${lowerFirst(body)}` : null;
    },
  ],
  [
    /^(.+?)(, and it's wearing on me| before the deadline| and I'm not sure what to do| for a while now)\.$/,
    (m, translate) => {
      const body = baseLine(translate, m[1] ?? "");
      return body ? `${body}${TAIL[m[2] ?? ""]}.` : null;
    },
  ],
  [
    /^(.+) — (any advice\?|wanted your take\.|could use guidance\.|mind if we discuss\?|your call\?)$/,
    (m, translate) => {
      const body = baseLine(translate, m[1] ?? "");
      return body ? `${body} — ${ASK[m[2] ?? ""]}` : null;
    },
  ],
  [
    /^(I|Am I|Should I) really(.*)$/,
    (m, translate) => {
      const plain = `${m[1]}${m[2]}`.replace(/^I '/, "I'");
      const body = known(translate, plain);
      return body ? `Thật sự là ${lowerFirst(body)}` : null;
    },
  ],
  [
    /^(.+) \((v2|polish|spike|rollout|hotfix|cleanup|metrics|tests|docs|beta|pilot|audit|refactor|monitoring|design)\)$/,
    (m, translate) => {
      const body = known(translate, m[1] ?? "");
      return body ? `${body} (${SPRINT_TAG[m[2] ?? ""]})` : null;
    },
  ],
  [
    /^(.+) — (lite|plus|for teams|mobile|international|automation|insights|self-serve|API|pilot|enterprise|starter|pro|embedded|analytics)$/,
    (m, translate) => {
      const body = known(translate, m[1] ?? "");
      return body ? `${body} — ${FEATURE_TAG[m[2] ?? ""]}` : null;
    },
  ],
  [/^Backlog item (\d+)$/, (m) => `Việc tồn đọng ${m[1]}`],
  [/^Idea (\d+)$/, (m) => `Ý tưởng ${m[1]}`],
  [
    /^Make the (.+) (white|green|orange|blue)\.$/,
    (m) => {
      const thing = PAINT[m[1] ?? ""];
      return thing ? `Đổi ${thing} sang màu ${COLOR[m[2] ?? ""]}.` : null;
    },
  ],
  [
    /^Remove the (.+)\.$/,
    (m, translate) => {
      const thing = known(translate, upperFirst(m[1] ?? ""));
      return thing ? `Bỏ ${lowerFirst(thing)} đi.` : null;
    },
  ],
  [
    /^Put the (.+) in the (.+)\.$/,
    (m, translate) => {
      const thing = known(translate, upperFirst(m[1] ?? ""));
      const place = known(translate, upperFirst(m[2] ?? ""));
      return thing && place
        ? `Đặt ${lowerFirst(thing)} vào ${lowerFirst(place)}.`
        : null;
    },
  ],
];
