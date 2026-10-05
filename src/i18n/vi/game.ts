/** Vietnamese for game rules, messages, and events. Keys are the English source. */
export const VI_GAME: Record<string, string> = {
  // Titles, tracks, work types
  Fresher: "Fresher",
  "Junior engineer": "Kỹ sư Junior",
  Engineer: "Kỹ sư",
  "Senior engineer": "Kỹ sư Senior",
  "Staff engineer": "Kỹ sư Staff",
  "Principal engineer": "Kỹ sư Principal",
  "Team lead": "Team Lead",
  "Engineering manager": "Engineering Manager",
  Director: "Giám đốc kỹ thuật",
  "Clean {game}": "{game} sạch",
  "Tidy the screen": "Dọn giao diện",
  "Spot the bug": "Tìm bug",
  "Connect the wires": "Nối dây",
  "Ship it": "Ship thôi",
  "One-on-one": "1:1",
  "Sprint planning": "Lên kế hoạch sprint",
  Roadmap: "Roadmap",
  Easy: "Dễ",
  Normal: "Thường",
  Hard: "Khó",
  Low: "Thấp",
  Medium: "Vừa",
  High: "Cao",
  Critical: "Khẩn cấp",
  Expert: "Chuyên gia",
  Seasoned: "Dày dạn",
  Solid: "Vững",
  Capable: "Khá",
  Beginner: "Mới bắt đầu",
  Experience: "Kinh nghiệm",
  Leadership: "Khả năng dẫn dắt",
  "You match": "Phù hợp",
  "Close match": "Gần phù hợp",
  "Long shot": "Khó đạt",
  Likely: "Nhiều khả năng",
  Maybe: "Có thể",
  Strong: "Mạnh",
  Fair: "Tạm",
  Weak: "Yếu",
  "Low fresher": "Fresher mức thấp",
  "Mid fresher": "Fresher mức trung",
  "High fresher": "Fresher mức cao",

  // The work clock
  Mon: "T2",
  Tue: "T3",
  Wed: "T4",
  Thu: "T5",
  Fri: "T6",
  "Overtime +{n}h": "OT +{n}h",
  "Overdue {span}": "Trễ {span}",
  "Due {when}": "Hạn {when}",
  "Due next {when}": "Hạn {when} tuần sau",
  "Due in {n} weeks": "Hạn sau {n} tuần",
  "{n} day": "{n} ngày",
  "{n} week": "{n} tuần",
  "Untitled task": "Việc chưa đặt tên",

  // Career messages
  "Placement: {label}.": "Xếp lớp: {label}.",
  "You join {company}.": "Bạn gia nhập {company}.",
  "The company": "Công ty",
  "{company} wants to talk. You're shortlisted.":
    "{company} muốn nói chuyện với bạn. Bạn đã lọt vào danh sách phỏng vấn.",
  "{company} is moving forward with other candidates.":
    "{company} đã chọn ứng viên khác.",
  "{company} passed on you this time. Try them again in a few days.":
    "{company} chưa chọn bạn lần này. Vài ngày nữa thử lại nhé.",
  "You join {company} as {title}. A step up.":
    "Bạn gia nhập {company} với vị trí {title}. Lên một cấp!",
  "You join {company} as {title}.":
    "Bạn gia nhập {company} với vị trí {title}.",
  "Promotion progress starts fresh, but your CV counts: {percent}% fewer tasks to your next promotion.":
    "Tiến độ thăng chức tính lại từ đầu, nhưng CV vẫn có giá trị: ít hơn {percent}% việc cho lần thăng chức tới.",
  "Promotion progress starts fresh here.":
    "Tiến độ thăng chức tính lại từ đầu ở đây.",
  "Signing bonus: +{amount}.": "Thưởng ký hợp đồng: +{amount}.",
  "Sign-on shares: {n} {ticker}.": "Cổ phiếu khi gia nhập: {n} {ticker}.",
  "A gym membership. You feel better already.":
    "Thẻ tập gym. Bạn thấy khỏe hơn rồi.",
  "Payday is now {amount}.": "Lương mỗi kỳ giờ là {amount}.",
  "{key} done well before the deadline.": "{key} xong sớm trước deadline.",
  "{key} done on time.": "{key} xong đúng hạn.",
  "{key} done late.": "{key} xong nhưng trễ hạn.",
  "{key}: the clock ran out. {hours}h gone, and the part is still open.":
    "{key}: hết giờ. Mất {hours}h mà phần này vẫn dang dở.",
  "{key}: part {part} of {parts} done in {hours}h.":
    "{key}: xong phần {part}/{parts} trong {hours}h.",
  "Bonus {amount}.": "Thưởng {amount}.",
  "Quick work: +{amount}.": "Làm nhanh: +{amount}.",
  "{key} is overdue. The team noticed.": "{key} đã trễ hạn. Cả team đều thấy.",
  "Urgent: {key} {title}.": "Gấp: {key} {title}.",
  "New: {key} {title}.": "Mới: {key} {title}.",
  "{n}h of overtime.": "{n}h OT.",
  "The screen matches the note.": "Giao diện đã khớp yêu cầu.",
  "You got there with almost no time left.": "Bạn kịp xong khi gần hết giờ.",
  "The clock ran out.": "Hết giờ.",
  "A little extra, {amount}.": "Thêm chút đỉnh, {amount}.",
  "You are now {title}. Payday is {amount}.":
    "Bạn giờ là {title}. Lương mỗi kỳ {amount}.",
  "Your work is people and plans now. Your team matters more than your code.":
    "Giờ việc của bạn là con người và kế hoạch. Team quan trọng hơn code của bạn.",
  "You are back to building. Your skill matters more again.":
    "Bạn quay lại làm sản phẩm. Kỹ năng lại quan trọng hơn.",
  "You are now {title}. Payday rises to {amount}.":
    "Bạn giờ là {title}. Lương mỗi kỳ tăng lên {amount}.",
  "New work unlocked: {game}.": "Mở khóa việc mới: {game}.",
  "The review did not pass this time. You can try again next week.":
    "Review lần này chưa qua. Tuần sau thử lại nhé.",
  "Work is done for this week.": "Xong việc tuần này.",
  "You wrapped up early: +{n} free-time slot.":
    "Bạn chốt tuần sớm: +{n} lượt rảnh.",
  "You wrapped up early: +{n} free-time slots.":
    "Bạn chốt tuần sớm: +{n} lượt rảnh.",
  "Overtime ate {n} free-time slot.": "OT đã ăn mất {n} lượt rảnh.",
  "Overtime ate {n} free-time slots.": "OT đã ăn mất {n} lượt rảnh.",
  "Certificate earned: {course}. That's worth something.":
    "Đã có chứng chỉ: {course}. Đáng giá đấy.",
  "{hobby}: {n}-week streak. It shows.":
    "{hobby}: chuỗi {n} tuần. Thấy rõ hiệu quả.",
  "Your side project is now {stage}. It earns a little each week while you keep at it.":
    "Dự án riêng của bạn giờ ở giai đoạn {stage}. Mỗi tuần kiếm được chút ít nếu bạn duy trì.",
  "Your side project is now {stage}.":
    "Dự án riêng của bạn giờ ở giai đoạn {stage}.",
  "Side project: another evening of commits.":
    "Dự án riêng: thêm một tối commit.",
  "You got the keys. It's yours.": "Bạn đã cầm chìa khóa. Nhà của bạn rồi.",
  "{device} is on the desk. Tasks get {n} extra seconds.":
    "{device} đã lên bàn. Mỗi việc được thêm {n} giây.",
  "You change into {look}.": "Bạn thay sang {look}.",
  "Next week's paper: {headlines}": "Báo tuần sau: {headlines}",
  "Next week's paper: a quiet week in business news.":
    "Báo tuần sau: một tuần tin tức kinh doanh yên ắng.",
  "Workline: {n} new job post for you.":
    "Workline: {n} tin tuyển dụng mới cho bạn.",
  "Workline: {n} new job posts for you.":
    "Workline: {n} tin tuyển dụng mới cho bạn.",
  "Payday as {title}. +{cash} cash.": "Nhận lương {title}. +{cash} tiền mặt.",
  "Payday as {title}. +{cash} cash and {n} {ticker} shares.":
    "Nhận lương {title}. +{cash} tiền mặt và {n} cổ phiếu {ticker}.",
  "Rent for the month: -{amount}.": "Tiền nhà tháng này: -{amount}.",
  "Year-end review: {n} clean tickets this year. Bonus +{amount}.":
    "Đánh giá cuối năm: {n} ticket sạch trong năm. Thưởng +{amount}.",
  "Year-end review: not much to show this year. No bonus.":
    "Đánh giá cuối năm: năm nay chưa có gì nổi bật. Không có thưởng.",
  "Missed deadlines: {keys}. Your reputation took a hit.":
    "Trễ deadline: {keys}. Uy tín của bạn bị ảnh hưởng.",
  "{n} ticket is still overdue from before.":
    "{n} ticket vẫn còn trễ hạn từ trước.",
  "{n} tickets are still overdue from before.":
    "{n} ticket vẫn còn trễ hạn từ trước.",
  "{keys} went to someone else. It was late too long.":
    "{keys} đã giao cho người khác. Trễ quá lâu rồi.",
  "Late nights caught up with you. You start Monday tired.":
    "Thức khuya đã tác dụng. Bạn bắt đầu thứ Hai trong mệt mỏi.",
  "Early nights all week. You feel it.": "Cả tuần ngủ sớm. Cảm nhận rõ luôn.",
  "A long week of work wore your mood down a little.":
    "Một tuần dài làm việc khiến tâm trạng đi xuống chút.",
  "You're not 22 anymore. Your body needs more care.":
    "Bạn không còn 22 tuổi nữa. Cơ thể cần chăm sóc hơn.",
  "You're running on empty. Next week you can't work. Rest.":
    "Bạn cạn kiệt rồi. Tuần sau không làm việc được. Nghỉ ngơi đi.",
  "You're sick next week. Doctor's bill: -{amount}.":
    "Tuần sau bạn bị ốm. Tiền khám: -{amount}.",
  "A teammate picked up {key} for you. Good team.":
    "Đồng đội đã nhận làm {key} giúp bạn. Team tốt thật.",
  "Your team covers for you. Every deadline moves a week.":
    "Team gánh giúp bạn. Mọi deadline lùi một tuần.",
  "Achievement: {title}.": "Thành tựu: {title}.",

  // Seasons and holidays
  Winter: "Mùa đông",
  Spring: "Mùa xuân",
  Summer: "Mùa hè",
  Autumn: "Mùa thu",
  "New Year": "Năm mới",
  "Lunar New Year": "Tết Nguyên đán",
  "Summer trip": "Du lịch hè",
  "Mid-Autumn Festival": "Tết Trung thu",
  "Black Friday": "Black Friday",
  "Year-end party": "Tiệc tất niên",

  // Goals and endings
  "Retire early": "Nghỉ hưu sớm",
  "Save and invest until you never need to work again.":
    "Tiết kiệm và đầu tư đến khi không cần đi làm nữa.",
  "Reach $500,000 net worth": "Đạt tài sản ròng $500,000",
  "Own a home": "Sở hữu nhà riêng",
  "Buy a place of your own, with a garden for the cat.":
    "Mua một chỗ của riêng mình, có vườn cho mèo.",
  "Buy a $180,000 home from the shop": "Mua căn nhà $180,000 trong cửa hàng",
  "Reach the top": "Lên đỉnh cao",
  "Climb as high as the ladder goes, on either track.":
    "Leo lên nấc cao nhất, ở hướng nào cũng được.",
  "Become Principal engineer or Director":
    "Trở thành Kỹ sư Principal hoặc Giám đốc kỹ thuật",
  "live well": "sống thật tốt",
  "You did it": "Bạn đã làm được",
  "You set out to {goal}, and at {age} you have. The cat approves.":
    "Bạn đặt mục tiêu {goal}, và ở tuổi {age} bạn đã đạt được. Mèo gật gù tán thành.",
  "Burned out": "Kiệt sức",
  "One morning you could not open the laptop. You step away to rebuild. It happens to good people.":
    "Một sáng nọ bạn không thể mở laptop. Bạn tạm dừng để hồi phục. Chuyện này xảy ra với cả người giỏi.",
  "Your body said stop": "Cơ thể bảo dừng lại",
  "Years of late nights caught up. The doctor's orders come first now.":
    "Bao năm thức khuya đã đến lúc trả giá. Giờ lời bác sĩ là trên hết.",
  "Retired at 60": "Nghỉ hưu ở tuổi 60",
  "The long road is over. You didn't quite {goal}, but you're still here, and so is the cat.":
    "Hành trình dài đã khép lại. Bạn chưa hẳn {goal}, nhưng bạn vẫn ở đây, và mèo cũng vậy.",

  // Free time and sleep
  Gym: "Tập gym",
  "Sweat it out.": "Đổ mồ hôi cho đã.",
  "Quiet night in": "Tối yên tĩnh ở nhà",
  "Tea, blanket, the cat.": "Trà, chăn ấm, và mèo.",
  "Dinner with friends": "Ăn tối với bạn bè",
  "Good food and bad jokes.": "Đồ ăn ngon và chuyện nhạt.",
  "Team drinks": "Nhậu với team",
  "Stories you can't repeat.": "Những chuyện không thể kể lại.",
  "Tech meetup": "Tech meetup",
  "Name tags and pizza.": "Thẻ tên và pizza.",
  "Date day": "Hẹn hò",
  "Brunch, a walk, something nice for two.":
    "Ăn sáng muộn, đi dạo, chút gì đó dễ thương cho hai người.",
  "Get outside": "Ra ngoài trời",
  "A hike, a bike ride, fresh air.":
    "Leo núi, đạp xe, hít thở không khí trong lành.",
  "Visit family": "Về thăm gia đình",
  "Home cooking and questions about your job.":
    "Cơm nhà và những câu hỏi về công việc.",
  "Weekend hackathon": "Hackathon cuối tuần",
  "Two days, no sleep, one demo.": "Hai ngày, không ngủ, một bản demo.",
  Vacation: "Đi du lịch",
  "A long weekend far from the laptop.": "Một kỳ nghỉ dài xa laptop.",
  Early: "Ngủ sớm",
  "In bed by ten. One less evening, a fresher body.":
    "Lên giường lúc 10 giờ. Bớt một buổi tối, cơ thể sảng khoái hơn.",
  "Seven hours, most nights.": "Ngủ bảy tiếng hầu hết các đêm.",
  Late: "Thức khuya",
  "One more evening of your own. Monday will hurt.":
    "Thêm một buổi tối cho riêng bạn. Thứ Hai sẽ mệt đấy.",

  // Pursuits
  "Frontend fundamentals": "Nền tảng Frontend",
  "Layouts, state, and the browser.": "Layout, state và trình duyệt.",
  "System design": "Thiết kế hệ thống",
  "Queues, caches, and trade-offs.": "Queue, cache và các đánh đổi.",
  "Leading people": "Dẫn dắt con người",
  "Feedback, one-on-ones, and hard talks.":
    "Feedback, 1:1 và những cuộc nói chuyện khó.",
  Running: "Chạy bộ",
  "A little further each week.": "Mỗi tuần xa thêm một chút.",
  Guitar: "Guitar",
  "Three chords and a dream.": "Ba hợp âm và một giấc mơ.",
  Cooking: "Nấu ăn",
  "Real food, made at home.": "Đồ ăn thật, nấu tại nhà.",
  Idea: "Ý tưởng",
  Prototype: "Bản thử",
  Launched: "Đã ra mắt",
  Growing: "Đang phát triển",
  Thriving: "Bùng nổ",
  "Your side project stalled. Users want updates.":
    "Dự án riêng đang chững lại. Người dùng muốn bản cập nhật.",
  "Side project ({stage}): +{amount}.": "Dự án riêng ({stage}): +{amount}.",

  // Achievements
  "Moving up": "Thăng tiến",
  "Get your first promotion.": "Được thăng chức lần đầu.",
  "People person": "Người của tập thể",
  "Move to the manager track.": "Chuyển sang hướng quản lý.",
  "Top before 30": "Đỉnh cao trước 30",
  "Reach Principal or Director before 30.":
    "Lên Principal hoặc Giám đốc kỹ thuật trước 30 tuổi.",
  "Six figures": "Sáu chữ số",
  "Reach $100,000 net worth.": "Đạt tài sản ròng $100,000.",
  Millionaire: "Triệu phú",
  "Reach $1,000,000 net worth.": "Đạt tài sản ròng $1,000,000.",
  Survivor: "Người sống sót",
  "Make it through a layoff wave.": "Vượt qua một đợt cắt giảm nhân sự.",
  "Job hopper": "Nhảy việc",
  "Change jobs three times.": "Đổi việc ba lần.",
  Negotiator: "Nhà đàm phán",
  "Talk an offer up.": "Thương lượng tăng được offer.",
  "Out of office": "Out of office",
  "Take a vacation.": "Đi du lịch một chuyến.",
  "Gym regular": "Dân gym chăm chỉ",
  "Go to the gym 20 times.": "Đi tập gym 20 lần.",
  "Healthy at 50": "Khỏe mạnh tuổi 50",
  "Turn 50 with health at 70 or more.":
    "Bước sang tuổi 50 với sức khỏe từ 70 trở lên.",
  Homeowner: "Chủ nhà",
  "Buy your own home.": "Mua nhà riêng.",

  // Rules on the mini-game screens
  "Now: anything that stops customers. Later: anything that can wait.":
    "Làm ngay: việc gì làm khách hàng bị chặn. Để sau: việc gì chờ được.",
  "Now: big impact, small effort. Later: small impact, big effort. Next: everything else.":
    "Làm ngay: tác động lớn, công sức nhỏ. Để sau: tác động nhỏ, công sức lớn. Tiếp theo: còn lại.",

  // Placement
  "The placement game went to the other side. Offers stay at the low end of fresher work: more guidance, less scope.":
    "Ván xếp lớp thuộc về đối thủ. Lời mời sẽ ở mức fresher thấp: được hướng dẫn nhiều hơn, phạm vi việc nhỏ hơn.",
  "A draw is a low fresher result. Companies will offer supervised work more often than ownership.":
    "Hòa là kết quả fresher mức thấp. Công ty sẽ giao việc có người kèm nhiều hơn là tự làm chủ.",
  "You won in {n} moves. That is the top of the fresher band: faster learning, more energy expected, still not a mid-level hire.":
    "Bạn thắng sau {n} nước. Đó là mức fresher cao nhất: học nhanh hơn, được kỳ vọng nhiều hơn, nhưng vẫn chưa phải mid-level.",
  "You won in 4 moves. Offers sit in the middle of fresher work: real tickets, a manager nearby.":
    "Bạn thắng sau 4 nước. Lời mời ở mức fresher trung bình: ticket thật, có manager kề bên.",
  "You won in {n} moves. A win, and still the low fresher band. The first offers will be narrower.":
    "Bạn thắng sau {n} nước. Thắng nhưng vẫn ở mức fresher thấp. Những lời mời đầu tiên sẽ hẹp hơn.",

  // Market
  Crypto: "Crypto",
  Gold: "Vàng",
  "Read the paper. Good news usually lifts a company the next week, bad news usually drops it. Usually, not always.":
    "Hãy đọc báo. Tin tốt thường đẩy giá công ty lên vào tuần sau, tin xấu thường kéo xuống. Thường thôi, không phải lúc nào cũng vậy.",
  "The biggest swings. Most weeks wobble. Some weeks crash hard, some shoot up. Over time it roughly holds its value, so luck matters more than patience.":
    "Biến động mạnh nhất. Hầu hết các tuần lắc lư. Có tuần sập mạnh, có tuần tăng vọt. Lâu dài giá trị gần như giữ nguyên, nên may mắn quan trọng hơn kiên nhẫn.",
  "Steady. Small moves, slowly upward. It tends to rise when crypto crashes.":
    "Ổn định. Biến động nhỏ, tăng chậm. Thường tăng khi crypto sập.",
  "It moves a lot.": "Giá biến động nhiều.",
  "It barely moves in a quiet week.": "Tuần yên ắng thì gần như không đổi.",
  "It moves a little most days.": "Hầu như ngày nào cũng nhích một chút.",
  "Startup software": "Phần mềm startup",
  "Product apps": "Ứng dụng sản phẩm",
  "Remote tools": "Công cụ làm việc từ xa",
  "Business software": "Phần mềm doanh nghiệp",
  "Big tech": "Big tech",
  "Coffee shops": "Chuỗi cà phê",
  "Electric cars": "Xe điện",
  "Video games": "Trò chơi điện tử",
  Groceries: "Bách hóa",
  Hardware: "Phần cứng",
  "Mobile apps": "Ứng dụng di động",
  "Data platforms": "Nền tảng dữ liệu",
  Collaboration: "Cộng tác",
  "Consumer apps": "Ứng dụng tiêu dùng",
  "Solar power": "Điện mặt trời",
  "Organic food": "Thực phẩm hữu cơ",
  Telecom: "Viễn thông",
  Publishing: "Xuất bản",
  "{name} signs a big three-year deal.": "{name} ký hợp đồng lớn ba năm.",
  "{name}'s new app update gets great reviews.":
    "Bản cập nhật app mới của {name} nhận nhiều đánh giá tốt.",
  "{name} sales beat what everyone expected.":
    "Doanh số {name} vượt mọi kỳ vọng.",
  "A famous investor buys a large stake in {name}.":
    "Một nhà đầu tư nổi tiếng mua lượng lớn cổ phần {name}.",
  "{name} opens a second office.": "{name} mở văn phòng thứ hai.",
  "{name} wins an award for its product.":
    "{name} giành giải thưởng cho sản phẩm.",
  "{name} lands its biggest customer yet.":
    "{name} có được khách hàng lớn nhất từ trước đến nay.",
  "{name} raises guidance for the year.": "{name} nâng dự báo cả năm.",
  "{name} launches in a new country.": "{name} ra mắt ở một quốc gia mới.",
  "{name} partners with a major platform.":
    "{name} hợp tác với một nền tảng lớn.",
  "{name} reports record quarterly profit.": "{name} báo lãi quý kỷ lục.",
  "{name}'s new hire gets glowing press.":
    "Nhân sự mới của {name} được báo chí khen ngợi.",
  "{name} recalls a product.": "{name} thu hồi một sản phẩm.",
  "{name}'s CEO leaves without a clear reason.":
    "CEO của {name} ra đi không rõ lý do.",
  "{name} sales come in below what was promised.":
    "Doanh số {name} thấp hơn cam kết.",
  "A big customer leaves {name} for a rival.":
    "Một khách hàng lớn rời {name} sang đối thủ.",
  "{name}'s app is down for most of the day.":
    "App của {name} sập gần như cả ngày.",
  "{name} is fined for a data mistake.": "{name} bị phạt vì sự cố dữ liệu.",
  "{name} delays its next product launch.":
    "{name} hoãn ra mắt sản phẩm tiếp theo.",
  "{name} cuts staff after a weak quarter.":
    "{name} cắt giảm nhân sự sau một quý yếu.",
  "{name} faces a lawsuit from a rival.": "{name} bị đối thủ kiện.",
  "{name}'s supply chain hits a snag.":
    "Chuỗi cung ứng của {name} gặp trục trặc.",
  "{name} loses a key patent case.":
    "{name} thua một vụ kiện bằng sáng chế quan trọng.",
  "{name} warns profits will be lower this year.":
    "{name} cảnh báo lợi nhuận năm nay sẽ giảm.",
  "Stocks: {up} up, {down} down.": "Cổ phiếu: {up} mã tăng, {down} mã giảm.",
  "Biggest move: {name} {percent}%.": "Biến động mạnh nhất: {name} {percent}%.",
  "Crypto is up at {price}.": "Crypto tăng lên {price}.",
  "Crypto is down at {price}.": "Crypto giảm xuống {price}.",
  "Gold is up at {price}.": "Vàng tăng lên {price}.",
  "Gold is down at {price}.": "Vàng giảm xuống {price}.",
  "Crypto crashed overnight. Gold picked up a little.":
    "Crypto sập trong đêm. Vàng tăng nhẹ.",
  "Crypto shot up overnight.": "Crypto tăng vọt trong đêm.",

  // Workline benefits and feed
  "Remote days": "Ngày làm từ xa",
  "Learning budget": "Ngân sách học tập",
  "Signing bonus": "Thưởng ký hợp đồng",
  "Sign-on shares": "Cổ phiếu khi gia nhập",
  "Gym membership": "Thẻ tập gym",
  "Work feels lighter.": "Công việc nhẹ nhàng hơn.",
  "You learn faster.": "Bạn học nhanh hơn.",
  "Cash on your first day.": "Có tiền ngay ngày đầu.",
  "Company shares on your first day.": "Có cổ phiếu công ty ngay ngày đầu.",
  "A healthier start.": "Khởi đầu khỏe mạnh hơn.",
  "Founder, stealth startup": "Founder, startup bí mật",
  Recruiter: "Recruiter",
  "Product designer": "Product designer",
  "Growth hacker": "Growth hacker",
  "VP Engineering": "VP Engineering",
  "People ops": "Nhân sự",
  DevRel: "DevRel",
  "QA lead": "QA lead",
  "Security engineer": "Kỹ sư bảo mật",
  "Product manager": "Product manager",
  "Founder, Series A": "Founder, Series A",
  Someone: "Ai đó",
  "I'm humbled to announce I renamed a variable. Thank you to everyone who believed in me.":
    "Tôi vô cùng vinh dự thông báo: tôi vừa đổi tên một biến. Cảm ơn tất cả những ai đã tin tưởng tôi.",
  "Hot take: this meeting could have been an email.":
    "Nói thật nhé: cuộc họp này lẽ ra chỉ cần một email.",
  "We just raised money! Now hiring a Senior Fresher with 10 years of experience.":
    "Chúng tôi vừa gọi vốn thành công! Đang tuyển Senior Fresher với 10 năm kinh nghiệm.",
  "Layoffs at a big company today. Be kind to the people around you.":
    "Hôm nay một công ty lớn cắt giảm nhân sự. Hãy tử tế với những người xung quanh.",
  "Day 400 of trying to center a box on a page.":
    "Ngày thứ 400 cố căn giữa một cái box trên trang.",
  "I asked my manager for feedback and got a calendar invite.":
    "Tôi xin manager feedback và nhận được một lời mời họp.",
  "Reminder: drink water. The bug will still be there after.":
    "Nhắc nhẹ: uống nước đi. Bug vẫn sẽ nằm đó chờ bạn.",
  "Five things my cat taught me about shipping on time.":
    "Năm điều con mèo dạy tôi về việc ship đúng hạn.",
  "My uncle says crypto is going up. My uncle also says a lot of things.":
    "Chú tôi bảo crypto sắp tăng. Chú tôi cũng bảo nhiều thứ lắm.",
  "Proud of the team for fixing the checkout on a Friday night. Please let us sleep.":
    "Tự hào về team đã sửa trang thanh toán vào tối thứ Sáu. Làm ơn cho bọn tôi ngủ.",
  "Just finished my 3rd coffee before 9am. Hiring? DM me.":
    "Vừa xong ly cà phê thứ 3 trước 9 giờ sáng. Đang tuyển à? Inbox mình nhé.",
  "Unpopular opinion: the old design was fine.":
    "Ý kiến trái chiều: thiết kế cũ vẫn ổn mà.",
  "Promoted to Team lead! My first task: learning everyone's coffee order.":
    "Được lên Team Lead rồi! Nhiệm vụ đầu tiên: nhớ món cà phê của từng người.",
  "Our office plant has more uptime than our app.":
    "Chậu cây văn phòng còn có uptime cao hơn app của chúng tôi.",
  "Shipped a one-line fix. Writing the post-mortem took longer than the fix.":
    "Ship một bản sửa một dòng. Viết post-mortem còn lâu hơn sửa.",
  "Anyone else feel like Slack is just a to-do list that talks back?":
    "Có ai thấy Slack giống một danh sách việc biết cãi lại không?",
  "We migrated to the cloud. The bill migrated upward too.":
    "Chúng tôi đã chuyển lên cloud. Hóa đơn cũng chuyển lên theo.",
  "Interview tip: when they ask about weakness, say you care too much. They love that.":
    "Mẹo phỏng vấn: khi hỏi điểm yếu, hãy nói bạn quá tận tâm. Họ thích lắm.",
  "My standup update: still blocked. My blocker: physics.":
    "Cập nhật standup: vẫn bị chặn. Thứ chặn tôi: vật lý.",
  "New job! Grateful for this journey. (Translation: I survived onboarding.)":
    "Việc mới! Biết ơn hành trình này. (Dịch: tôi sống sót qua onboarding.)",
  "If AI replaces engineers, who will fix the AI's CSS?":
    "Nếu AI thay thế kỹ sư, ai sẽ sửa CSS cho AI?",
  "Remote work pro: no commute. Remote work con: the commute from bed to desk.":
    "Ưu điểm làm từ xa: không phải đi lại. Nhược điểm: phải đi từ giường ra bàn.",
  "We hit 99.9% uptime. The 0.1% was during my demo.":
    "Chúng tôi đạt 99,9% uptime. 0,1% còn lại rơi đúng lúc tôi demo.",
  "Just learned our prod database is named after someone's cat. Respect.":
    "Vừa biết database production được đặt theo tên mèo của ai đó. Nể.",
  "Three reverts later, I am once again at peace with main.":
    "Sau ba lần revert, tôi lại hòa bình với nhánh main.",
  "Posting to stay visible. Visibility does not equal productivity, but here we are.":
    "Đăng bài cho có mặt. Có mặt không có nghĩa là năng suất, nhưng thôi kệ.",
  "Our intern fixed the bug senior engineers missed. Intern is going places.":
    "Bạn intern sửa được bug mà các senior bỏ sót. Intern này có tương lai.",
  "Budget season means one thing: free lunch in exchange for your honest feedback.":
    "Mùa ngân sách chỉ có một nghĩa: bữa trưa miễn phí đổi lấy feedback thật lòng.",
  "I code in dark mode because my bugs feel less scary that way.":
    "Tôi code bằng dark mode vì như thế bug trông bớt đáng sợ.",

  // Events: holidays
  "Happy New Year": "Chúc mừng năm mới",
  "Fireworks over the city. You've been at {company} for {weeks} weeks, and the company grew {percent}% last year. Your New Year bonus is {amount}. Pick a resolution.":
    "Pháo hoa rực sáng thành phố. Bạn đã làm ở {company} được {weeks} tuần, và năm qua công ty tăng trưởng {percent}%. Thưởng năm mới của bạn là {amount}. Chọn một quyết tâm nào.",
  "Fireworks over the city. You've been at {company} for {weeks} weeks, and the company shrank {percent}% last year. Your New Year bonus is {amount}. Pick a resolution.":
    "Pháo hoa rực sáng thành phố. Bạn đã làm ở {company} được {weeks} tuần, và năm qua công ty giảm {percent}%. Thưởng năm mới của bạn là {amount}. Chọn một quyết tâm nào.",
  "Fireworks over the city. No company to thank this year, but a fresh start. Pick a resolution.":
    "Pháo hoa rực sáng thành phố. Năm nay chẳng có công ty nào để cảm ơn, nhưng là một khởi đầu mới. Chọn một quyết tâm nào.",
  "Get healthier": "Sống khỏe hơn",
  "More walks, fewer snacks.": "Đi bộ nhiều hơn, ăn vặt ít đi.",
  "Learn something new": "Học điều gì đó mới",
  "One course, finished this time.": "Một khóa học, lần này học cho xong.",
  "See friends more": "Gặp bạn bè nhiều hơn",
  "Put dinners in the calendar.": "Đưa các bữa tối vào lịch.",
  "Speak up at work": "Mạnh dạn phát biểu",
  "Share the idea in the meeting.": "Nói ra ý tưởng trong cuộc họp.",
  "Red envelopes and family dinners. {company} gives you {amount} in lucky money.":
    "Lì xì và những bữa cơm gia đình. {company} lì xì bạn {amount}.",
  "Red envelopes and family dinners. Stay six months at a company to get lucky money.":
    "Lì xì và những bữa cơm gia đình. Làm ở một công ty đủ sáu tháng để được lì xì.",
  "Go home for the holiday": "Về quê ăn Tết",
  "Long trip, full heart.": "Đường xa, lòng ấm.",
  "Stay in the city": "Ở lại thành phố",
  "Quiet streets for once.": "Hiếm hoi phố xá yên tĩnh.",
  "Company summer trip": "Du lịch hè cùng công ty",
  "{company} is taking everyone to the beach for two days.":
    "{company} đưa cả công ty đi biển hai ngày.",
  "Go on the trip": "Đi cùng mọi người",
  "Sunburn and team games.": "Cháy nắng và trò chơi team building.",
  "Skip it": "Bỏ qua",
  "Two quiet days at home.": "Hai ngày yên tĩnh ở nhà.",
  "Summer is here": "Hè đến rồi",
  "Everyone is posting beach photos.": "Ai cũng đăng ảnh đi biển.",
  "Go to the beach": "Đi biển",
  "Worth it.": "Đáng lắm.",
  "Stay home": "Ở nhà",
  "A fan and a book.": "Một cái quạt và một cuốn sách.",
  "Lanterns in the street and mooncakes in every shop.":
    "Đèn lồng khắp phố và bánh trung thu ở mọi cửa hàng.",
  "Bring mooncakes for the team": "Mang bánh trung thu cho team",
  "Everyone loves the lotus ones.": "Ai cũng mê bánh nhân sen.",
  "Keep them for yourself": "Giữ lại ăn một mình",
  "No regrets.": "Không hối hận.",
  "Buy a box of mooncakes": "Mua một hộp bánh trung thu",
  "Machines in the Shop are {percent}% off this week only.":
    "Máy tính trong Cửa hàng giảm {percent}% chỉ trong tuần này.",
  "Good to know": "Biết rồi",
  "The sale ends when the week does.": "Đợt giảm giá kết thúc khi hết tuần.",
  "Holiday parties": "Tiệc cuối năm",
  "{company} rents a hall. There's karaoke. There's always karaoke.":
    "{company} thuê hẳn hội trường. Có karaoke. Lúc nào cũng có karaoke.",
  "Friends are throwing a holiday party.": "Bạn bè tổ chức tiệc cuối năm.",
  "Go and sing": "Đi và hát",
  "Pick the song carefully.": "Chọn bài cho khéo.",
  "Early night.": "Ngủ sớm.",
  Go: "Đi",
  "Bring snacks.": "Mang đồ ăn vặt.",
  "Stay in": "Ở nhà",

  // Events: work and life
  "Layoffs announced": "Thông báo cắt giảm nhân sự",
  "{company} is cutting teams this week. Everyone waits for an email. A good reputation and a close team make you harder to cut.":
    "{company} cắt giảm nhân sự tuần này. Ai cũng chờ một email. Uy tín tốt và team gắn kết giúp bạn khó bị cắt hơn.",
  "Wait for the email": "Chờ email",
  "Nothing to do but hope.": "Chẳng làm gì được ngoài hy vọng.",
  "The startup ran out of money": "Startup hết tiền",
  "{company} could not raise its next round. The office closes on Friday.":
    "{company} không gọi được vòng vốn tiếp theo. Văn phòng đóng cửa vào thứ Sáu.",
  "Pack your desk": "Dọn bàn làm việc",
  "Time to find something new.": "Đến lúc tìm việc mới rồi.",
    "{company} is being bought": "{company} sắp bị mua lại",
  "A bigger company is buying {company}. {ticker} jumps on the news.":
    "Một công ty lớn hơn đang mua lại {company}. {ticker} tăng vọt nhờ tin này.",
  Celebrate: "Ăn mừng",
  "Your shares just got more valuable.": "Cổ phiếu của bạn vừa có giá hơn.",
  "A new manager": "Manager mới",
  "Your manager moved on. The new one doesn't know you yet.":
    "Manager cũ đã nghỉ. Người mới chưa biết bạn là ai.",
  "Book a coffee chat": "Hẹn cà phê nói chuyện",
  "Start on the right foot.": "Khởi đầu suôn sẻ.",
  "Keep your head down": "Cứ cắm mặt làm việc",
  "Let the work speak.": "Để kết quả tự lên tiếng.",
  "Conference invite": "Lời mời diễn giả",
  "You're invited to speak at a small conference. The company won't pay for it.":
    "Bạn được mời nói ở một hội thảo nhỏ. Công ty không chi trả.",
  "Go and speak": "Đi và trình bày",
  "Learn a lot and get noticed.": "Học được nhiều và được chú ý.",
  "Maybe next year.": "Để năm sau vậy.",
  "A recruiter messaged you": "Một recruiter nhắn tin cho bạn",
  '"I came across your profile and think you\'d be perfect for a role one step up."':
    '"Mình thấy hồ sơ của bạn và nghĩ bạn rất hợp với một vị trí cao hơn một bậc."',
  "Take a look": "Xem thử",
  "It goes to the top of Workline.": "Tin này sẽ nằm đầu Workline.",
  "Not now": "Để sau",
  "You're happy where you are.": "Bạn đang hài lòng với chỗ hiện tại.",
  "Market crash": "Thị trường sập",
  "Every screen is red. Stocks fall hard and crypto falls harder.":
    "Màn hình nào cũng đỏ. Cổ phiếu giảm mạnh, crypto còn giảm mạnh hơn.",
  "Hold on": "Giữ nguyên",
  "It usually comes back. Usually.": "Thường thì sẽ hồi lại. Thường thôi.",
  "Sell everything": "Bán hết",
  "Turn it all into cash at today's low prices.":
    "Đổi hết ra tiền mặt theo giá thấp hôm nay.",
  "Family needs help": "Gia đình cần giúp đỡ",
  "A relative is short on rent this month and asks for {amount}.":
    "Một người thân thiếu tiền nhà tháng này và hỏi mượn {amount}.",
  "Send the money": "Gửi tiền",
  "It feels right.": "Cảm thấy đúng.",
  "Say no": "Từ chối",
  "You need it too.": "Bạn cũng cần số tiền đó.",
  "A friend's wedding": "Đám cưới bạn thân",
  "An old friend is getting married. Flights, a gift, a suit.":
    "Một người bạn cũ sắp cưới. Vé máy bay, quà mừng, bộ vest.",
  "Dance badly and cry a little.": "Nhảy dở tệ và khóc một chút.",
  "Send your regrets": "Gửi lời xin lỗi",
  "They'll understand. Mostly.": "Họ sẽ hiểu thôi. Phần lớn là vậy.",
  "Your phone broke": "Điện thoại bị hỏng",
  "It slipped out of your pocket at the worst angle.":
    "Nó tuột khỏi túi đúng góc tệ nhất.",
  "Buy a new one": "Mua cái mới",
  "Back to normal.": "Trở lại bình thường.",
  "Live without it": "Sống chung với nó",
  "A cracked screen for a while.": "Dùng màn hình nứt một thời gian.",
  "The cat is sick": "Mèo bị ốm",
  "The cat won't eat and keeps sleeping in odd places.":
    "Mèo bỏ ăn và cứ ngủ ở những chỗ lạ.",
  "Go to the vet": "Đưa đi thú y",
  "Peace of mind.": "Cho yên tâm.",
  "Wait and see": "Chờ xem sao",
  "Probably nothing.": "Chắc không sao đâu.",
  "You won the office raffle": "Bạn trúng bốc thăm ở công ty",
  "A gift card you never entered for. Someone put your name in.":
    "Một thẻ quà tặng bạn chưa từng đăng ký. Ai đó đã ghi tên bạn vào.",
  "Claim it": "Nhận quà",
  "A small treat.": "Một món quà nho nhỏ.",

  // Event outcomes
  "You were laid off. Severance: {amount}. Workline is the next stop.":
    "Bạn bị cho nghỉ việc. Trợ cấp: {amount}. Điểm dừng tiếp theo là Workline.",
  "You made it through. The office is very quiet.":
    "Bạn đã trụ lại được. Văn phòng im ắng hẳn.",
  "The startup closed. No severance. Workline is the next stop.":
    "Startup đóng cửa. Không có trợ cấp. Điểm dừng tiếp theo là Workline.",
  "{ticker} jumped 30% on the news.": "{ticker} tăng 30% nhờ tin này.",
  "The stock": "Cổ phiếu",
  "The coffee chat went well. A good start.":
    "Buổi cà phê suôn sẻ. Khởi đầu tốt.",
  "The new manager doesn't really know what you do yet.":
    "Manager mới vẫn chưa thực sự biết bạn làm gì.",
  "Your talk went well. People want to connect.":
    "Bài nói thành công. Nhiều người muốn kết nối với bạn.",
  "You let it pass.": "Bạn bỏ qua.",
  "A stretch role is waiting at the top of Workline.":
    "Một vị trí cao hơn đang chờ ở đầu Workline.",
  "The role was already filled.": "Vị trí đã có người.",
  "You sold everything for {amount}.": "Bạn đã bán hết, thu về {amount}.",
  "You held on and tried not to look.":
    "Bạn giữ nguyên và cố không nhìn bảng giá.",
  "They're grateful. You feel good about it.":
    "Họ rất biết ơn. Bạn thấy vui vì điều đó.",
  "It was the right call for you, but it stings.":
    "Đó là lựa chọn đúng cho bạn, nhưng vẫn thấy nhói.",
  "A beautiful day. Your feet hurt.": "Một ngày tuyệt đẹp. Chân bạn đau nhừ.",
  "You watch the photos from home.": "Bạn xem ảnh từ nhà.",
  "A new phone. Same notifications.": "Điện thoại mới. Thông báo vẫn vậy.",
  "Squinting at a cracked screen gets old.":
    "Nheo mắt nhìn màn hình nứt mãi cũng chán.",
  "Just a tummy bug. The cat is fine.":
    "Chỉ rối loạn tiêu hóa thôi. Mèo ổn rồi.",
  "The cat recovers slowly. You worried all week.":
    "Mèo hồi phục chậm. Bạn lo cả tuần.",
  "A $200 gift card. Nice.": "Thẻ quà tặng $200. Tuyệt.",
  "Resolution: get healthier.": "Quyết tâm: sống khỏe hơn.",
  "Resolution: learn something new.": "Quyết tâm: học điều gì đó mới.",
  "Resolution: see friends more.": "Quyết tâm: gặp bạn bè nhiều hơn.",
  "Resolution: speak up at work.": "Quyết tâm: mạnh dạn phát biểu.",
  "{resolution} New Year bonus: {amount}.":
    "{resolution} Thưởng năm mới: {amount}.",
  "Lucky money: {amount}.": "Lì xì: {amount}.",
  "Home for the holiday.": "Về quê ăn Tết.",
  "A quiet holiday in the city.": "Một cái Tết yên tĩnh ở thành phố.",
  "Sunburned and closer to the team.": "Cháy nắng nhưng thân với team hơn.",
  "Salt air helps.": "Gió biển thật dễ chịu.",
  "A quiet summer week.": "Một tuần hè yên ả.",
  "The team fights over the last lotus mooncake.":
    "Cả team tranh nhau cái bánh nhân sen cuối cùng.",
  "You eat the whole box. No regrets.": "Bạn ăn hết cả hộp. Không hối hận.",
  "The Shop sale is on until the week ends.": "Cửa hàng giảm giá đến hết tuần.",
  "You sang. People will talk about it.":
    "Bạn đã hát. Mọi người sẽ còn nhắc mãi.",
  "A good night with friends.": "Một buổi tối vui với bạn bè.",
  "An early night.": "Một buổi tối đi ngủ sớm.",

  // Workplace events
  "Demo day crunch": "Chạy deadline demo day",
  "The big demo is on Friday and half of it doesn't work yet.": "Buổi demo lớn vào thứ Sáu mà một nửa vẫn chưa chạy.",
  "Pull an all-nighter": "Thức trắng đêm",
  "Make it work. Feel it tomorrow.": "Cứ làm cho chạy đã. Mai mệt tính sau.",
  "Cut the scope": "Cắt bớt scope",
  "Show less, but show it working.": "Demo ít thôi, nhưng phải chạy.",
  "Payday is late": "Lương về trễ",
  "{company}'s next funding round is slipping. The founder asks if everyone can wait an extra week for this month's pay.": "Vòng gọi vốn tiếp theo của {company} bị chậm. Founder hỏi mọi người có thể chờ lương tháng này thêm một tuần không.",
  "Wait for it": "Chờ thêm",
  "Next payday comes a week late.": "Kỳ lương tới sẽ trễ một tuần.",
  "Quietly start looking": "Lặng lẽ tìm việc mới",
  "A new role goes to the top of Workline.": "Một vị trí mới lên đầu Workline.",
  "You're also DevOps now": "Giờ bạn kiêm luôn DevOps",
  "The only person who knew the servers just left. Someone has to keep them running.": "Người duy nhất rành server vừa nghỉ. Phải có ai đó giữ cho hệ thống chạy.",
  "Take it on": "Nhận luôn",
  "Learn a lot, sleep less.": "Học được nhiều, ngủ ít đi.",
  "Say it's not your job": "Nói đó không phải việc của mình",
  "Someone else can learn it.": "Để người khác học.",
  "A message at 11pm": "Tin nhắn lúc 11 giờ đêm",
  "The founder: \"Quick question, are you up?\" It is never a quick question.": "Founder nhắn: \"Hỏi nhanh xíu, em còn thức không?\" Chưa bao giờ là hỏi nhanh xíu.",
  "Answer now": "Trả lời ngay",
  "Fix it tonight.": "Sửa luôn trong đêm.",
  "Reply in the morning": "Sáng mai trả lời",
  "Sleep first.": "Ngủ trước đã.",
  "The round closed": "Gọi vốn thành công",
  "{company} raised its next round. Pizza, a toast, and a raise for the whole team.": "{company} vừa gọi vốn xong. Có pizza, nâng ly, và cả team được tăng lương.",
  "Your pay goes up.": "Lương bạn tăng.",
  "Reorg": "Tái cơ cấu",
  "Your team is being merged with another one. New manager, new process, same work.": "Team bạn bị gộp với một team khác. Sếp mới, quy trình mới, việc vẫn vậy.",
  "Roll with it": "Thuận theo",
  "Get to know the new people.": "Làm quen người mới.",
  "Ask to stay with your old lead": "Xin ở lại với lead cũ",
  "Works if you're close.": "Được nếu hai người thân.",
  "Performance calibration": "Họp calibration đánh giá",
  "Managers are ranking everyone this week. Your self-review is due Friday.": "Tuần này các sếp xếp hạng mọi người. Bản tự đánh giá của bạn hạn chót thứ Sáu.",
  "Write a bold self-review": "Viết tự đánh giá thật mạnh",
  "Pays off if people already know your work.": "Có lợi nếu mọi người đã biết việc bạn làm.",
  "Keep it modest": "Viết khiêm tốn",
  "Safe and forgettable.": "An toàn và dễ quên.",
  "Compliance training": "Đào tạo tuân thủ",
  "Four hours of required videos about passwords and gifts. There's a quiz at the end.": "Bốn tiếng video bắt buộc về mật khẩu và quà tặng. Cuối buổi có bài kiểm tra.",
  "Click through it at work": "Bấm cho qua trong giờ làm",
  "Uses 4 hours of this week.": "Tốn 4 tiếng của tuần này.",
  "Do it on Saturday": "Làm vào thứ Bảy",
  "Keeps your hours, costs a weekend day.": "Giữ giờ làm, mất một ngày cuối tuần.",
  "Team building weekend": "Team building cuối tuần",
  "{company} booked a resort for team games and a gala dinner. Coming is optional, officially.": "{company} đặt resort cho trò chơi team building và gala dinner. Về lý thuyết thì không bắt buộc.",
  "Uses a weekend day.": "Mất một ngày cuối tuần.",
  "A quiet weekend.": "Một cuối tuần yên tĩnh.",
  "Yearly health check": "Khám sức khỏe định kỳ",
  "A big company perk: a free health check at a hospital across town.": "Phúc lợi công ty lớn: khám sức khỏe miễn phí ở bệnh viện bên kia thành phố.",
  "A 10pm call with the US team": "Họp lúc 10 giờ tối với team Mỹ",
  "The only time that works in both timezones is 10pm for you.": "Khung giờ duy nhất hợp cả hai múi giờ là 10 giờ tối bên bạn.",
  "Join the call": "Vào họp",
  "Be there when it's decided.": "Có mặt khi chốt quyết định.",
  "Ask for notes": "Xin biên bản họp",
  "Sleep instead.": "Đi ngủ thôi.",
  "The undersea cable is cut": "Đứt cáp quang biển",
  "The internet to the rest of the world crawls. Your calls freeze mid-sentence.": "Mạng đi quốc tế chậm như rùa. Cuộc gọi đứng hình giữa câu.",
  "Work from a café": "Ra quán cà phê làm",
  "Better Wi-Fi, a lot of coffee.": "Wi-Fi tốt hơn, cà phê thì nhiều.",
  "Push through at home": "Cố làm ở nhà",
  "Uses 8 hours of this week.": "Tốn 8 tiếng của tuần này.",
  "A lonely week": "Một tuần cô đơn",
  "You haven't said a word out loud since Monday.": "Từ thứ Hai tới giờ bạn chưa nói thành tiếng câu nào.",
  "Rent a coworking desk": "Thuê chỗ ở coworking",
  "Other people, real ones.": "Có người thật xung quanh.",
  "Call a friend": "Gọi cho bạn bè",
  "An hour on the phone.": "Một tiếng trò chuyện.",
  "Home office stipend": "Trợ cấp góc làm việc tại nhà",
  "{company} sends {amount} to set up your home office.": "{company} gửi {amount} để bạn sắm sửa góc làm việc tại nhà.",
  "Buy a good chair": "Mua một cái ghế tốt",
  "Your back will thank you.": "Lưng bạn sẽ cảm ơn.",
  "Keep the cash": "Giữ tiền mặt",
  "The old chair is fine. Probably.": "Ghế cũ vẫn ổn. Chắc vậy.",
  "The neighbor is drilling": "Nhà hàng xóm khoan tường",
  "Next door is renovating. The drill starts at 8am and doesn't stop.": "Nhà bên đang sửa. Máy khoan chạy từ 8 giờ sáng không nghỉ.",
  "Go to a café": "Ra quán cà phê",
  "A quiet corner.": "Một góc yên tĩnh.",
  "Put on headphones": "Đeo tai nghe",
  "You can still feel it.": "Vẫn cảm thấy rung.",
  "The demo worked. You slept through Saturday.": "Demo chạy ngon. Bạn ngủ li bì cả thứ Bảy.",
  "A smaller demo, but nothing crashed. The founder wanted more.": "Demo nhỏ hơn nhưng không crash. Founder thì muốn nhiều hơn.",
  "The founder thanks you in front of everyone. Next payday will be a week late.": "Founder cảm ơn bạn trước cả team. Kỳ lương tới sẽ trễ một tuần.",
  "You start looking. A new role is waiting at the top of Workline.": "Bạn bắt đầu tìm việc. Một vị trí mới đang chờ ở đầu Workline.",
  "You look around. Nothing good this week.": "Bạn ngó quanh. Tuần này chưa có gì hay.",
  "You learned more about servers this week than in four years of college.": "Tuần này bạn học về server nhiều hơn cả bốn năm đại học.",
  "Someone else took the pager. The team noticed.": "Người khác nhận trực hệ thống. Cả team đều để ý.",
  "An hour later it was fixed. The founder sent a heart.": "Một tiếng sau là xong. Founder thả tim.",
  "You slept. In the morning it was already fine.": "Bạn đi ngủ. Sáng ra mọi thứ đã ổn.",
  "Pizza for everyone.": "Pizza cho mọi người.",
  "Your pay goes up {percent}%. Payday is now {amount}.": "Lương bạn tăng {percent}%. Mỗi kỳ lương giờ là {amount}.",
  "Your old lead asked for you by name. You stay together.": "Lead cũ xin đích danh bạn. Hai người vẫn chung team.",
  "Too late. The new org chart is final, and now it's awkward.": "Muộn rồi. Sơ đồ tổ chức mới đã chốt, giờ thì hơi ngại.",
  "New names, a new standup time. You're starting over with a new manager.": "Tên mới, giờ standup mới. Bạn làm lại từ đầu với sếp mới.",
  "A solid, safe review. Nobody will remember it.": "Một bản đánh giá chắc chắn, an toàn. Chẳng ai nhớ.",
  "Your manager backed every line. Rated above expectations.": "Sếp bảo vệ từng dòng. Bạn được xếp loại vượt kỳ vọng.",
  "The committee thought it read a little big.": "Hội đồng thấy viết hơi quá.",
  "You passed the quiz on Saturday morning.": "Bạn làm xong bài kiểm tra vào sáng thứ Bảy.",
  "You passed the quiz. Four hours gone.": "Bạn qua bài kiểm tra. Mất toi bốn tiếng.",
  "Your team won the tug of war. Your manager knows your name now.": "Team bạn thắng kéo co. Giờ sếp đã nhớ tên bạn.",
  "A quiet weekend. Monday's photos are mostly of other people.": "Một cuối tuần yên tĩnh. Ảnh hôm thứ Hai toàn người khác.",
  "All fine. The doctor says to sleep more.": "Mọi thứ ổn. Bác sĩ dặn ngủ nhiều hơn.",
  "You were the most awake person on the call. Barely.": "Bạn là người tỉnh nhất cuộc họp. Suýt soát.",
  "The notes were thin. You missed a decision.": "Biên bản sơ sài. Bạn lỡ mất một quyết định.",
  "The café's line is faster. The coffee adds up.": "Mạng ở quán nhanh hơn. Tiền cà phê thì cộng dồn.",
  "Pages loaded one picture at a time. You lost a day.": "Trang web tải từng tấm ảnh một. Bạn mất trắng một ngày.",
  "Other humans. You talked about keyboards for an hour.": "Có người thật. Bạn nói chuyện bàn phím cả tiếng.",
  "An hour on the phone. You feel like a person again.": "Một tiếng nói chuyện điện thoại. Bạn thấy mình là người trở lại.",
  "Your back stops complaining.": "Lưng hết kêu ca.",
  "Extra cash this month. Your back has opinions.": "Tháng này dư chút tiền. Cái lưng thì có ý kiến.",
  "A quiet corner and decent coffee.": "Một góc yên tĩnh và cà phê ổn áp.",
  "Headphones on. You can still feel the drill in your teeth.": "Đeo tai nghe rồi mà vẫn thấy máy khoan rung tận răng.",
  "The late pay arrived: +{amount}.": "Lương trễ đã về: +{amount}.",
  "The late pay never came.": "Khoản lương trễ không bao giờ về.",
  "Payday is late. {company} owes you {amount}.": "Lương về trễ. {company} còn nợ bạn {amount}.",
};
