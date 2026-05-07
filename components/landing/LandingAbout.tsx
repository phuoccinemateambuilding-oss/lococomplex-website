import Reveal from "@/components/Reveal";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";

export function LandingAbout() {
  return (
    <section id="intro" className="relative overflow-hidden bg-cream py-24 text-ink md:py-32">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-loco-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-loco-red/8 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="max-w-[640px]">
          <Reveal>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-loco-red">
              <Sparkle weight="fill" className="h-3.5 w-3.5" />
              Về LOCO Complex
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display-vn font-extrabold mt-6 text-3xl uppercase text-ink md:text-5xl" style={{ lineHeight: 1.5 }}>
              Khu Giải Trí NEWTRO Quận 1
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 md:text-[17px]">
              <p>
                <strong className="font-semibold text-ink">LOCO Complex</strong>{" "}là khu phức hợp giải trí phong cách NEWTRO tại 11 Nam Quốc Cang, Phường Phạm Ngũ Lão, Quận 1, TP.HCM — nơi GenZ aesthetics gặp gỡ retro vibes trong không gian 2 tầng. Hơn 300 chỗ từ standing đến VIP Sofa, tất cả hướng về sân khấu âm nhạc sống động đêm này qua đêm khác.
              </p>
              <p>Dress code trẻ trung, thanh lịch — đến với phong cách của bạn, phần còn lại để LOCO lo. Floor 1 Hip-hop Club cho những ai yêu nhịp điệu đường phố, Floor 2 Heatroom mini nightclub với Top 40, EDM và House cho đêm không ngủ.</p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/15 pt-8">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-ink/55">Sức chứa</dt>
                <dd className="font-display-vn font-extrabold mt-2 text-3xl uppercase text-loco-red md:text-4xl">300</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-ink/55">Mở cửa</dt>
                <dd className="font-display-vn font-extrabold mt-2 text-3xl uppercase text-loco-red md:text-4xl">18:00</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-ink/55">Loại Bàn</dt>
                <dd className="font-display-vn font-extrabold mt-2 text-3xl uppercase text-loco-red md:text-4xl">8 tier</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
