/** Vietnamese for game content: companies, gear, pantry, tickets, and tidy scenes. Keys are the English source. */
export const VI_CONTENT: Record<string, string> = {
  // Companies
  Seed: "Hạt giống",
  Growth: "Tăng trưởng",
  Established: "Ổn định",
  Giant: "Tập đoàn",
  Startup: "Startup",
  "Big company": "Công ty lớn",
  Remote: "Remote",
  Product: "Product",
  Agency: "Agency",
  Enterprise: "Doanh nghiệp",
  "Remote-first": "Ưu tiên làm từ xa",
  "Four people and a whiteboard. You will touch everything, and the days run hot.":
    "Bốn người và một tấm bảng trắng. Bạn sẽ đụng tới mọi thứ, và ngày nào cũng nóng.",
  "Client work in short bursts. Breadth over ownership.":
    "Làm dự án khách hàng theo từng đợt ngắn. Đa dạng hơn là làm chủ.",
  "A startup that already has users. High fresher scope, high energy cost.":
    "Một startup đã có người dùng. Fresher được giao nhiều việc, tốn nhiều năng lượng.",
  "One product, one queue. You learn the system instead of a new client every week.":
    "Một sản phẩm, một hàng đợi việc. Bạn hiểu sâu hệ thống thay vì đổi khách hàng mỗi tuần.",
  "Remote-first. Quieter days, slower feedback, fewer interruptions built into the salary.":
    "Ưu tiên làm từ xa. Ngày yên tĩnh hơn, feedback chậm hơn, ít bị làm phiền, và lương đã tính cả điều đó.",
  "A known product company. Process exists. So does a mentor.":
    "Một công ty product có tiếng. Có quy trình. Có cả mentor.",
  "Enterprise delivery. Reputation moves more than skill. The calendar is part of the job.":
    "Triển khai cho doanh nghiệp lớn. Uy tín quan trọng hơn kỹ năng. Lịch họp cũng là một phần công việc.",
  "A giant. High fresher pay, narrow first tasks, a long path to owning anything.":
    "Một tập đoàn khổng lồ. Lương fresher cao, việc đầu tiên hẹp, còn lâu mới được làm chủ thứ gì.",
  "Hardware sketches and firmware patches. Small team, loud standups, real ownership.":
    "Phác thảo phần cứng và vá firmware. Team nhỏ, standup ồn ào, làm chủ thật sự.",
  "Design-led client sprints. You ship mockups and the occasional production fix.":
    "Sprint cho khách hàng dẫn dắt bởi thiết kế. Bạn ship mockup và thỉnh thoảng sửa lỗi production.",
  "A mobile product with steady releases. You learn one codebase deeply.":
    "Một sản phẩm di động release đều đặn. Bạn hiểu sâu một codebase.",
  "Data platforms for big clients. Slower pace, heavier compliance, solid pay.":
    "Nền tảng dữ liệu cho khách hàng lớn. Nhịp chậm hơn, nhiều quy định hơn, lương ổn định.",
  "Async-first product shop. Fewer meetings, written specs, calm weeks.":
    "Công ty product ưu tiên làm việc bất đồng bộ. Ít họp, spec viết rõ, những tuần êm ả.",
  "Long client relationships and polished delivery. Less equity, more predictability.":
    "Quan hệ khách hàng lâu dài và bàn giao chỉn chu. Ít cổ phần hơn, dễ đoán hơn.",
  "Fully distributed team across time zones. Flexible hours baked into the culture.":
    "Team làm việc phân tán khắp các múi giờ. Giờ giấc linh hoạt đã thành văn hóa.",
  "A household name in apps. Strong benefits, narrow scope at first, long runway.":
    "Một cái tên quen thuộc trong làng app. Phúc lợi tốt, phạm vi việc ban đầu hẹp, đường dài phía trước.",

  // Machines and looks
  "Starter laptop": "Laptop khởi đầu",
  "Thick bezel. Tasks get the base time.":
    "Viền dày. Mỗi việc có thời gian gốc.",
  "Thin laptop": "Laptop mỏng",
  "Lighter glass. Every task gets 2 more seconds.":
    "Màn hình nhẹ hơn. Mỗi việc thêm 2 giây.",
  "Desk monitor": "Màn hình rời",
  "The work sits on a bigger screen. 4 extra seconds.":
    "Công việc nằm trên màn hình lớn hơn. Thêm 4 giây.",
  "Home rig": "Dàn máy ở nhà",
  "Wide glass in front of you. 6 extra seconds.":
    "Màn hình rộng ngay trước mặt. Thêm 6 giây.",
  "Short hair, rust shirt": "Tóc ngắn, áo màu gạch",
  "Bun, rust shirt": "Búi tóc, áo màu gạch",
  "Curls, black shirt": "Tóc xoăn, áo đen",
  "Cap, navy shirt": "Mũ lưỡi trai, áo xanh navy",
  "Short hair, navy shirt": "Tóc ngắn, áo xanh navy",
  "Bun, green shirt": "Búi tóc, áo xanh lá",
  "Messy hair, sage hoodie": "Tóc rối, hoodie xanh xám",
  "Curls, cream sweater": "Tóc xoăn, áo len kem",
  "Low bun, ink cardigan": "Búi thấp, cardigan xanh mực",
  "Clip, soft blue shirt": "Kẹp tóc, áo xanh nhạt",
  Tablet: "Máy tính bảng",
  "A small folio. Pool piece.": "Một bao da nhỏ. Mảnh trong bộ sưu tập.",
  Ultrawide: "Màn hình siêu rộng",
  "One long screen. Pool piece.": "Một màn hình dài. Mảnh trong bộ sưu tập.",
  "Side screen": "Màn hình phụ",
  "A tiny extra glass. Pool piece.":
    "Một màn hình phụ nhỏ xíu. Mảnh trong bộ sưu tập.",
  "Loft laptop": "Laptop Loft",
  "Chunky keys. Pool piece.": "Phím bấm dày. Mảnh trong bộ sưu tập.",
  "Studio rig": "Dàn máy studio",
  "Two screens on a wood stand. Pool piece.":
    "Hai màn hình trên giá gỗ. Mảnh trong bộ sưu tập.",
  "Thin monitor": "Màn hình mỏng",
  "A pale thin frame. Pool piece.":
    "Khung viền mỏng màu nhạt. Mảnh trong bộ sưu tập.",

  // Pantry
  Coffee: "Cà phê",
  "A small lift.": "Tỉnh táo hơn chút.",
  "Energy drink": "Nước tăng lực",
  "A big lift. Your body pays a little.":
    "Tỉnh hẳn. Cơ thể phải trả giá chút ít.",
  Vitamins: "Vitamin",
  "Slowly back to normal.": "Từ từ trở lại bình thường.",
  "Recovery pill": "Thuốc hồi phục",
  "Feel like yourself again.": "Lại thấy mình là chính mình.",

  // Ticket titles
  "Checkout button sits off-center on mobile":
    "Nút thanh toán bị lệch trên mobile",
  "Settings page spacing drifted after the redesign":
    "Khoảng cách trang Cài đặt bị lệch sau đợt thiết kế lại",
  "Empty state shows the wrong illustration":
    "Màn hình trống hiển thị sai hình minh họa",
  "Header overlaps the menu on small screens":
    "Header đè lên menu trên màn hình nhỏ",
  "Profile card uses last year's colors":
    "Thẻ hồ sơ vẫn dùng màu của năm ngoái",
  "Onboarding step 3 doesn't match the mockup":
    "Bước 3 onboarding không khớp mockup",
  "Dark mode leaves one panel bright white":
    "Dark mode còn sót một panel trắng chói",
  "Pricing table columns are out of line": "Các cột bảng giá bị lệch hàng",
  "Toast messages cover the save button": "Thông báo toast che mất nút Lưu",
  "Login form fields are different widths":
    "Các ô trong form đăng nhập rộng hẹp khác nhau",
  "QA found a regression in search results":
    "QA phát hiện lỗi hồi quy ở kết quả tìm kiếm",
  "Customer says the total is wrong at checkout":
    "Khách hàng báo tổng tiền sai khi thanh toán",
  "Screenshot diff failed on the dashboard":
    "So sánh ảnh chụp màn hình dashboard bị fail",
  "Something changed on the invoice page":
    "Có gì đó thay đổi trên trang hóa đơn",
  "Support ticket: avatar missing for some users":
    "Ticket hỗ trợ: một số người dùng bị mất avatar",
  "Release candidate looks different from design":
    "Bản release candidate khác với thiết kế",
  "Translation broke a label on the cart":
    "Bản dịch làm hỏng một nhãn trong giỏ hàng",
  "A/B test variant shows the wrong badge":
    "Phiên bản A/B test hiển thị sai huy hiệu",
  "Nightly visual test flagged the home page":
    "Test giao diện chạy đêm báo lỗi trang chủ",
  "Crash report points at the order summary":
    "Báo cáo crash chỉ vào trang tóm tắt đơn hàng",
  "Wire the payment API to the new checkout":
    "Nối API thanh toán vào luồng checkout mới",
  "Connect the signup form to the auth service":
    "Kết nối form đăng ký với auth service",
  "Route webhooks to the notification queue":
    "Định tuyến webhook vào hàng đợi thông báo",
  "Hook the search box up to the new index": "Nối ô tìm kiếm vào index mới",
  "Link the mobile app to the feature flags":
    "Liên kết app mobile với feature flag",
  "Pipe analytics events to the warehouse":
    "Đẩy sự kiện analytics vào data warehouse",
  "Connect the upload button to storage": "Kết nối nút tải lên với storage",
  "Move the email job onto the new worker":
    "Chuyển job gửi email sang worker mới",
  "Point the dashboard at the read replica": "Trỏ dashboard sang read replica",
  "Join the chat widget to the support inbox":
    "Nối widget chat vào hộp thư hỗ trợ",
  "Cut the release for version 4.2": "Cắt bản release cho phiên bản 4.2",
  "Roll out the new onboarding to everyone":
    "Triển khai onboarding mới cho tất cả mọi người",
  "Hotfix the login bug to production": "Hotfix bug đăng nhập lên production",
  "Ship the pricing page before the launch":
    "Ship trang bảng giá trước ngày ra mắt",
  "Deploy the database migration tonight": "Deploy migration database tối nay",
  "Release the Android build to the store": "Release bản Android lên store",
  "Turn on the feature flag for all users":
    "Bật feature flag cho toàn bộ người dùng",
  "Push the security patch to every region":
    "Đẩy bản vá bảo mật tới mọi khu vực",
  "Promote staging to production": "Đưa staging lên production",
  "Ship the holiday banner on time": "Ship banner ngày lễ cho kịp",
  "Triage this week's bug reports": "Phân loại báo cáo bug tuần này",
  "Sort the support queue before standup": "Dọn hàng đợi hỗ trợ trước standup",
  "Answer the partner team's questions": "Trả lời câu hỏi của team đối tác",
  "Clear the review requests waiting on you":
    "Xử lý các yêu cầu review đang chờ bạn",
  "Go through the on-call handoff notes": "Đọc ghi chú bàn giao on-call",
  "Reply to the design feedback thread": "Trả lời thread góp ý thiết kế",
  "Sort incoming feature requests": "Phân loại các yêu cầu tính năng mới",
  "Clean up the alerts channel": "Dọn dẹp kênh cảnh báo",
  "Work through the security questionnaire": "Hoàn thành bảng câu hỏi bảo mật",
  "Catch up on the incident follow-ups": "Theo kịp các việc sau sự cố",
  "One-on-one with a new hire": "1:1 với nhân viên mới",
  "Check in with someone who seems tired": "Hỏi han một người trông có vẻ mệt",
  "Career talk with your strongest engineer":
    "Nói chuyện sự nghiệp với kỹ sư giỏi nhất team",
  "Follow up on last week's hard feedback":
    "Theo dõi lại buổi feedback khó tuần trước",
  "Coffee chat with a teammate thinking of leaving":
    "Cà phê với một thành viên đang tính nghỉ",
  "Weekly one-on-one with the tech lead": "1:1 hàng tuần với tech lead",
  "Talk through a conflict between two teammates":
    "Gỡ rối mâu thuẫn giữa hai thành viên",
  "Growth plan for a junior engineer":
    "Lộ trình phát triển cho một kỹ sư junior",
  "Welcome back chat after parental leave":
    "Chào đón một người trở lại sau kỳ nghỉ sinh",
  "Listen to concerns about the reorg":
    "Lắng nghe những lo lắng về đợt tái cơ cấu",
  "Plan the next sprint": "Lên kế hoạch sprint tiếp theo",
  "Re-plan after the outage ate two days":
    "Lên lại kế hoạch sau khi sự cố ngốn mất hai ngày",
  "Fit the launch work into this sprint": "Nhét việc ra mắt vào sprint này",
  "Balance bugs and features for the sprint":
    "Cân bằng bug và tính năng cho sprint",
  "Plan around two people on holiday":
    "Lên kế hoạch khi có hai người nghỉ phép",
  "Squeeze in the security fixes": "Chen các bản sửa bảo mật vào",
  "Rebalance the sprint after a scope change":
    "Cân lại sprint sau khi đổi phạm vi",
  "Plan the hardening sprint before release":
    "Lên kế hoạch sprint ổn định trước release",
  "Size the backlog for next sprint": "Ước lượng backlog cho sprint tới",
  "Plan the sprint with the new teammate":
    "Lên kế hoạch sprint cùng thành viên mới",
  "Draft next quarter's roadmap": "Phác thảo roadmap quý tới",
  "Choose what to cut from the launch": "Chọn phần cần cắt khỏi đợt ra mắt",
  "Rank the requests from sales": "Xếp hạng các yêu cầu từ team sales",
  "Plan the year with product leads": "Lên kế hoạch năm cùng các product lead",
  "Decide on the platform rewrite": "Quyết định việc viết lại nền tảng",
  "Order the migration projects": "Sắp thứ tự các dự án migration",
  "Pick the team's bets for next half":
    "Chọn những canh bạc của team cho nửa năm tới",
  "Review the roadmap after the reorg": "Rà soát roadmap sau tái cơ cấu",
  "Balance tech debt against new features":
    "Cân bằng nợ kỹ thuật với tính năng mới",
  "Prepare the roadmap for the board meeting":
    "Chuẩn bị roadmap cho cuộc họp hội đồng quản trị",
  "Production is down": "Production sập rồi",
  "Checkout errors are spiking": "Lỗi thanh toán đang tăng vọt",
  "A big customer can't log in": "Một khách hàng lớn không đăng nhập được",
  "The CEO found a bug in the demo": "CEO phát hiện bug trong buổi demo",
  "Payments are failing in one region": "Thanh toán đang lỗi ở một khu vực",
  "The app store rejected the build": "App store từ chối bản build",

  // Tidy: the ten base scenes
  Basket: "Giỏ",
  Sandwich: "Bánh mì kẹp",
  Ant: "Con kiến",
  Ball: "Quả bóng",
  Napkin: "Khăn giấy",
  "Empty spot": "Chỗ trống",
  Cloth: "Tấm khăn",
  "Take the ant off the blanket.": "Đuổi con kiến ra khỏi tấm thảm.",
  "Put the napkin on the empty spot.": "Đặt khăn giấy vào chỗ trống.",
  Popcorn: "Bỏng ngô",
  Map: "Bản đồ",
  "Wrong sign": "Biển sai",
  Cup: "Cốc",
  Ticket: "Vé",
  Window: "Cửa sổ",
  Tag: "Nhãn",
  "Take down the wrong sign.": "Gỡ tấm biển sai xuống.",
  "Put the ticket in the window.": "Đặt vé vào cửa sổ.",
  Frame: "Khung",
  Lens: "Ống kính",
  Trash: "Rác",
  Cord: "Dây cáp",
  Photo: "Ảnh",
  "Open frame": "Khung trống",
  "Take the trash out of the picture.": "Bỏ rác ra khỏi bức ảnh.",
  "Put the photo in the frame.": "Đặt ảnh vào khung.",
  "Song title": "Tên bài hát",
  "Static noise": "Tiếng rè",
  Volume: "Âm lượng",
  "Album cover": "Bìa album",
  "Cover spot": "Chỗ đặt bìa",
  Player: "Trình phát",
  "Remove the static noise.": "Bỏ tiếng rè đi.",
  "Put the album cover in its spot.": "Đặt bìa album vào đúng chỗ.",
  Sun: "Mặt trời",
  "Snowman in July": "Người tuyết tháng Bảy",
  Cloud: "Mây",
  "Umbrella tip": "Mẹo mang ô",
  "Tip box": "Ô mẹo",
  Sky: "Bầu trời",
  "Remove the snowman. It's July.": "Bỏ người tuyết đi. Đang tháng Bảy mà.",
  "Put the umbrella tip in the tip box.": "Đặt mẹo mang ô vào ô mẹo.",
  "Dog photo": "Ảnh chó",
  Adopt: "Nhận nuôi",
  "Price: $0,00.0": "Giá: $0,00.0",
  Bone: "Khúc xương",
  "Name tag": "Thẻ tên",
  Collar: "Vòng cổ",
  Card: "Thẻ",
  "Remove the broken price.": "Bỏ cái giá bị lỗi đi.",
  "Put the name tag on the collar.": "Gắn thẻ tên vào vòng cổ.",
  Steps: "Số bước",
  Timer: "Hẹn giờ",
  Sock: "Chiếc tất",
  Spoon: "Cái thìa",
  "Dish photo": "Ảnh món ăn",
  "Photo spot": "Chỗ đặt ảnh",
  Header: "Header",
  "Take the sock out of the ingredients.": "Lấy chiếc tất ra khỏi nguyên liệu.",
  "Put the dish photo on top.": "Đặt ảnh món ăn lên trên cùng.",
  "Hello!": "Xin chào!",
  Send: "Gửi",
  "Hello! Hello!": "Xin chào! Xin chào!",
  Smile: "Mặt cười",
  Avatar: "Avatar",
  "Profile circle": "Vòng tròn hồ sơ",
  Bubble: "Bong bóng chat",
  "Remove the doubled message.": "Xóa tin nhắn bị lặp.",
  "Put the avatar in the profile circle.": "Đặt avatar vào vòng tròn hồ sơ.",
  Balance: "Số dư",
  Transfer: "Chuyển khoản",
  Coin: "Đồng xu",
  "Bank card": "Thẻ ngân hàng",
  Wallet: "Ví",
  "Top bar": "Thanh trên cùng",
  "Remove the scary wrong balance.": "Xóa số dư sai đáng sợ kia đi.",
  "Put the bank card in the wallet.": "Đặt thẻ ngân hàng vào ví.",
  Pin: "Ghim",
  Route: "Lộ trình",
  "Road in the ocean": "Con đường giữa biển",
  Tree: "Cái cây",
  "Home icon": "Biểu tượng nhà",
  "Start point": "Điểm xuất phát",
  "Route line": "Đường lộ trình",
  "Remove the road in the ocean.": "Xóa con đường giữa biển.",
  "Put the home icon at the start point.":
    "Đặt biểu tượng nhà vào điểm xuất phát.",
  white: "trắng",
  green: "xanh lá",
  orange: "cam",
  blue: "xanh dương",
};
