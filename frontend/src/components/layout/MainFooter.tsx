import React from "react";

const MainFooter: React.FC = () => {
    return (
        <footer
            id="contact"
            className="border-t border-orange-500/20 bg-black/80 text-neutral-400">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
                <div>
                    <h3 className="text-lg font-bold tracking-wide text-orange-300">
                        QUEUES & CUES
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-400">
                        Không gian billiards hiện đại, trải nghiệm thi đấu đỉnh cao cho người chơi ở mọi cấp độ.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-200">
                        Điều hướng
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>
                            <a href="#home" className="transition-colors hover:text-orange-300">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#about" className="transition-colors hover:text-orange-300">
                                Về chúng tôi
                            </a>
                        </li>
                        <li>
                            <a href="#branches" className="transition-colors hover:text-orange-300">
                                Hệ thống chi nhánh
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-200">
                        Liên hệ
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>Email: contact@queuescues.vn</li>
                        <li>Hotline: 1900 0000</li>
                        <li>Giờ hoạt động: 08:00 - 02:00</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-orange-500/10 py-4 text-center text-xs text-neutral-500">
                © {new Date().getFullYear()} QUEUES & CUES. All rights reserved.
            </div>
        </footer>
    );
};

export default MainFooter;