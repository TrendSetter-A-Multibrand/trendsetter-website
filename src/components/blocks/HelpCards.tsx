/**
 * Three 586x187 cards under the shop list. The icons are lifted straight out of
 * the Figma export, so their viewBox keeps the page coordinates - each one is a
 * 112 square centred on the artwork.
 */

type HelpCard = {
  title: string;
  text: string;
  href: string;
  icon: "support" | "phone" | "faq";
};

const DEFAULT_CARDS: HelpCard[] = [
  {
    title: "Обратная связь",
    text: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
    href: "#",
    icon: "support",
  },
  {
    title: "Контакты",
    text: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
    href: "#",
    icon: "phone",
  },
  {
    title: "FAQs",
    text: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
    href: "#",
    icon: "faq",
  },
];

export function HelpCards({ cards = DEFAULT_CARDS }: { cards?: HelpCard[] }) {
  return (
    <section className="grid gap-6 px-6 lg:grid-cols-3 lg:gap-10 lg:px-10">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex items-center gap-4 bg-ink/6 p-6 lg:h-[187px] lg:gap-0 lg:p-0"
        >
          <div className="flex shrink-0 justify-center text-brand lg:w-[194px]">
            <Icon name={card.icon} />
          </div>
          {/* 21 from the top in the mockup rather than centred - the icon is
              what sits on the card's middle */}
          <div className="flex flex-col lg:self-start lg:pt-[21px]">
            <p className="text-base font-semibold lg:text-xl/6">{card.title}</p>
            <p className="mt-3 text-sm lg:mt-3.5 lg:text-base/5">{card.text}</p>
            <a
              href={card.href}
              className="mt-5 flex h-[49px] w-[180px] items-center justify-center bg-ink font-mono text-sm uppercase tracking-[3px] text-white lg:mt-6"
            >
              Подробнее
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}

const ICONS = {
  support: {
    viewBox: "81 817.5 112 112",
    paths: [
      "M179.584 903.917H173.5C170.142 903.917 167.417 901.191 167.417 897.833V867.417C167.417 864.059 170.142 861.333 173.5 861.333H179.584C186.306 861.333 191.75 866.778 191.75 873.5V891.75C191.75 898.472 186.306 903.917 179.584 903.917Z",
      "M100.5 903.917H94.4167C87.6946 903.917 82.25 898.472 82.25 891.75V873.5C82.25 866.778 87.6946 861.333 94.4167 861.333H100.5C103.858 861.333 106.583 864.059 106.583 867.417V897.833C106.583 901.191 103.858 903.917 100.5 903.917Z",
      "M176.541 861.333V858.292C176.541 836.452 158.839 818.75 137 818.75C115.161 818.75 97.458 836.452 97.458 858.292V861.333",
      "M140.802 929.771H133.198C129 929.771 125.594 926.364 125.594 922.167C125.594 917.969 129 914.562 133.198 914.562H140.802C145 914.562 148.406 917.969 148.406 922.167C148.406 926.364 145 929.771 140.802 929.771Z",
      "M148.406 922.167H161.333C168.055 922.167 173.5 916.722 173.5 910V903.917",
    ],
  },
  phone: {
    viewBox: "704.5 817.5 112 112",
    paths: [
      "M802.827 901.544L795.642 894.408C792.053 890.843 786.234 890.843 782.651 894.408L777.004 900.017C775.742 901.27 773.831 901.69 772.202 900.978C764.019 897.419 755.934 892.023 748.725 884.863C741.546 877.734 736.132 869.74 732.542 861.643C731.795 859.97 732.23 858.005 733.535 856.71L738.594 851.685C742.704 847.603 742.704 841.83 739.114 838.265L731.929 831.129C727.145 826.377 719.388 826.377 714.604 831.129L710.615 835.091C706.081 839.594 704.192 846.098 705.418 852.531C708.44 868.396 717.657 885.766 732.523 900.529C747.389 915.292 764.878 924.446 780.853 927.447C787.331 928.665 793.88 926.789 798.414 922.286L802.827 917.903C807.611 913.151 807.611 905.447 802.827 901.544Z",
      "M766.292 843.029C772.607 842.943 778.952 845.267 783.773 850.055",
      "M801.094 832.851C791.484 823.306 778.885 818.531 766.292 818.531",
      "M790.847 867.417C790.933 861.145 788.593 854.842 783.772 850.055",
      "M801.094 832.851C810.704 842.396 815.512 854.909 815.512 867.417",
    ],
    circles: [],
  },
  faq: {
    viewBox: "1334.33 817.5 112 112",
    paths: [
      "M1390.33 882.629V873.5C1397.06 873.5 1402.5 868.051 1402.5 861.328C1402.5 854.606 1397.06 849.157 1390.33 849.157C1383.61 849.157 1378.16 854.606 1378.16 861.328",
      "M1390.33 897.539C1390.16 897.539 1390.03 897.676 1390.03 897.844C1390.03 898.012 1390.16 898.148 1390.33 898.148C1390.5 898.148 1390.64 898.012 1390.64 897.844C1390.64 897.676 1390.5 897.539 1390.33 897.539",
    ],
    circle: { cx: 1390.33, cy: 873.5, r: 54.7728 },
  },
} as const;

function Icon({ name }: { name: HelpCard["icon"] }) {
  const icon = ICONS[name];
  const circle = "circle" in icon ? icon.circle : null;

  return (
    <svg
      viewBox={icon.viewBox}
      width="110"
      height="110"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[72px] w-[72px] lg:h-[110px] lg:w-[110px]"
    >
      {icon.paths.map((d) => (
        <path key={d} d={d} />
      ))}
      {circle && <circle cx={circle.cx} cy={circle.cy} r={circle.r} />}
    </svg>
  );
}
