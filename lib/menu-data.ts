// Branch-specific menu data
// Each branch has its own independent menu with all categories

export interface MenuItem {
  name: string;
  price?: number;
  pricePerKg?: number;
  desc?: string;
  image: string;
  delivery?: boolean;
  active?: boolean;
}

export interface MenuCategory {
  title: string;
  byWeight?: boolean;
  items: MenuItem[];
}

export type MenuData = Record<string, MenuCategory>;
export type BranchMenuData = Record<string, MenuData>;

// Category ID to Arabic name mapping
export const categoryNames: Record<string, string> = {
  shawarma: "الشاورما",
  italian: "الإيطالي",
  sandwiches: "السندويشات الغربية",
  easternSweets: "الحلويات الشرقية",
  westernSweets: "الكيك والحلويات الغربية",
  barSweets: "حلويات البار",
  drinks: "المشروبات",
  salads: "السلطات",
  gelato: "الجيلاتو",
};

// Helper to apply default value for active
function withDefaultActive(items: MenuItem[]): MenuItem[] {
  return items.map((item) => ({
    ...item,
    active: item.active ?? true, // default to false if not set
  }));
}

// Gaza Branch Menu
const gazaMenu: MenuData = {
  shawarma: {
    title: "الشاورما",
    items: withDefaultActive([
      {
        name: "بيتا شاورما",
        price: 10,
        image: "/menu/shawarma/54.jpg",
        // active: false,
      },
      {
        name: "شاورما عادي",
        price: 15,
        image: "/menu/shawarma/48.jpg",
        active: true,
      },
      { name: "فرشوحه دبل", price: 17, image: "/menu/shawarma/49.jpg" },
      {
        name: "فرشوحه دبل لحمة",
        price: 23,
        image: "/menu/shawarma/48.jpg",
      },
      {
        name: "فرشوحه دبل دبل",
        price: 25,
        image: "/menu/shawarma/48.jpg",
        delivery: false,
      },
      { name: "سوري", price: 28, image: "/menu/shawarma/53.jpg" },
      {
        name: "صفيحة",
        price: 30,
        desc: "شاورما - جبنة - زيتون اسود",
        image: "/menu/shawarma/51.jpg",
      },
      {
        name: "باشكا",
        price: 40,
        desc: "خبزة باشكا - شاورما - جبنة - زيتون - صوص بيكانتي",
        image: "/menu/shawarma/18.jpg",
      },
      {
        name: "شاورما عربي",
        price: 30,
        desc: "قطع شاورما - جبنة - زيتون اسود",
        image: "/menu/shawarma/17.jpg",
      },
      {
        name: "شاورما نابلسي",
        price: 30,
        desc: "شاورما - بطاطا - صوص بيكانتي - جبنة - زيتون اسود",
        image: "/menu/shawarma/19.jpg",
      },
      { name: "صحن شاورما كبير", price: 30, image: "/menu/shawarma/14.jpg" },
      { name: "صحن شاورما صغير", price: 20, image: "/menu/shawarma/13.jpg" },
    ]),
  },
  italian: {
    title: "الإيطالي",
    items: withDefaultActive([
      {
        name: "كاليزوني دجاج",
        price: 30,
        desc: "صدر دجاج - جبنة - زيتون - رانش",
        image: "/menu/italian/35.jpg",
      },
      {
        name: "كاليزوني خضار",
        price: 15,
        desc: "فليفلة - بصل - ذرة - مشروم - زيتون",
        image: "/menu/italian/32.jpg",
      },
      {
        name: "بيتزا مكسيكي دجاج",
        price: 20,
        desc: "صدر دجاج - جبنة - زيتون",
        image: "/menu/italian/33.jpg",
      },
      {
        name: "ميجا",
        price: 30,
        desc: "صدر دجاج - فليفلة - مشروم - جرادة - بصل - كريمة طعام",
        image: "/menu/italian/34.jpg",
      },
      {
        name: "بيتزا",
        price: 15,
        desc: "خضار - ذرة - زيتون",
        image: "/menu/italian/32.jpg",
      },
      {
        name: "بيتزا ماما روزا بالاناناس",
        price: 15,
        desc: "أناناس",
        image: "/menu/italian/2.jpg",
      },
      {
        name: "نابولي",
        price: 15,
        desc: "بيتزا بالتونة والزيتون",
        image: "/menu/italian/3.jpg",
      },
      {
        name: "مارجريتا",
        price: 15,
        desc: "جبنة",
        image: "/menu/italian/1.jpg",
      },
      {
        name: "صوص إضافي",
        price: 3,
        image:
          "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80",
      },
    ]),
  },
  sandwiches: {
    title: "السندويشات الغربية",
    items: withDefaultActive([
      {
        name: "زينجر",
        price: 25,
        desc: "شرائح صدر دجاج متبّلة مع بندورة طازجة، جرجير، حلقات بصل",
        image: "/menu/western/44.jpg",
      },
      {
        name: "بيف برجر",
        price: 25,
        desc: "قطعة لحمة - بصل - بندورة - جبنة - مخلل - صوص بيكانتي",
        image: "/menu/western/40.jpg",
      },
      {
        name: "بيغ ماك",
        price: 35,
        desc: "قطعتين لحمة - بصل - بندورة - جبنة - مخلل - صوص بيكانتي",
        image: "/menu/western/46.jpg",
      },
      {
        name: "تشكن بيتزا",
        price: 25,
        desc: "صدر دجاج - مشروم - فليفلة - بصل - زيتون اسود - جبنة",
        image: "/menu/western/42.jpg",
      },
      {
        name: "شيش طاووق",
        price: 25,
        desc: "فخد دجاج - جرجير - بندورة -مخلل -صوص بيكانتي",
        image: "/menu/western/47.jpg",
      },
      {
        name: "فطيرة الذهبية",
        price: 25,
        desc: "صدر دجاج - فليفلة - بصل - زيتون اسود - جبنة - ذرة - كريمة طعام",
        image: "/menu/western/43.jpg",
      },
    ]),
  },
  easternSweets: {
    title: "الحلويات الشرقية",
    byWeight: true,
    items: withDefaultActive([
      { name: "نمورة", pricePerKg: 15, image: "/menu/sweets/25.jpeg" },
      { name: "بسبوسة", pricePerKg: 20, image: "/menu/sweets/81.jpeg" },
      { name: "كلاج", pricePerKg: 20, image: "/menu/sweets/3.1.jpg" },
      { name: "عش البلبل", pricePerKg: 30, image: "/menu/sweets/7.jpg" },
      { name: "نابلسية", pricePerKg: 60, image: "/menu/sweets/23.jpg" },
      { name: "كنافة عربية", pricePerKg: 40, image: "/menu/sweets/11.jpg" },
      { name: "معكوفة لوز", pricePerKg: 35, image: "/menu/sweets/6.jpg" },
      { name: "كول واشكر", pricePerKg: 30, image: "/menu/sweets/5.jpg" },
      { name: "سنيورة", pricePerKg: 30, image: "/menu/sweets/8.jpg" },
      { name: "سرة", pricePerKg: 35, image: "/menu/sweets/2.jpg" },
      { name: "وربات", pricePerKg: 35, image: "/menu/sweets/2.jpg" },
      { name: "معكوفة عين جمل", pricePerKg: 35, image: "/menu/sweets/26.jpg" },
      {
        name: "بسبوسة نوتيلا",
        pricePerKg: 40,
        image: "/menu/sweets/18.jpeg",
      },
      { name: "بقلاوة عين جمل", pricePerKg: 55, image: "/menu/sweets/41.jpg" },
      { name: "بقلاوة لوز", pricePerKg: 48, image: "/menu/sweets/9.jpg" },
      { name: "بقلاوة حلبي", pricePerKg: 100, image: "/menu/sweets/10.jpg" },
      {
        name: "أساور لوز",
        pricePerKg: 48,

        image: "/menu/sweets/19.jpeg",
      },
      { name: "كاسات مكسرات", pricePerKg: 80, image: "/menu/sweets/24.jpg" },
      {
        name: "بورما حلبي",
        pricePerKg: 100,
        image:
          "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80",
        active: false,
      },
      {
        name: "بلورية حلبي",
        pricePerKg: 130,
        image:
          "https://images.unsplash.com/photo-1571167530149-c6f274f6db8f?w=800&q=80",
        active: false,
      },
      { name: "دولمة حلبي", pricePerKg: 130, image: "/menu/sweets/27.jpg" },
    ]),
  },
  westernSweets: {
    title: "الكيك والحلويات الغربية",
    items: withDefaultActive([
      { name: "قالب كيك صغير", price: 60, image: "/menu/cake/9.jpg" },
      { name: "قالب كيك كبير", price: 80, image: "/menu/cake/10.jpg" },
      { name: "قالب كيك اسبيسشل صغير", price: 80, image: "/menu/cake/38.jpg" },
      { name: "قالب كيك اسبيسشل كبير", price: 100, image: "/menu/cake/38.jpg" },
      { name: "سويس رول", price: 8, image: "/menu/cake/31.jpg" },
      { name: "تريلتشا", price: 10, image: "/menu/cake/21.jpg" },
      {
        name: "قطع كيك كلاسيكي",
        price: 5,
        desc: "نوتيلا / بيستاشيو / لوتس",
        image: "/menu/cake/30.jpg",
      },
      {
        name: "قطع كيك سبيشل",
        price: 10,
        desc: "نوتيلا / بيستاشيو / لوتس",
        image: "/menu/cake/30.jpg",
      },
      {
        name: "سوبريم",
        price: 18,
        desc: "لوتس - نوتيلا - بيستاشيو",
        image: "/menu/cake/28.jpg",
      },
      {
        name: "موس",
        price: 15,
        desc: "كيندر- لوتس - نوتيلا - بيستاشيو",
        image: "/menu/cake/4.jpg",
      },
      { name: "تشيس كيك", price: 15, image: "/menu/cake/7.jpg" },
      { name: "كرانش بار", price: 15, image: "/menu/cake/23.jpg" },
      { name: "قالب نص بلاطة", price: 150, image: "/menu/cake/8.1.jpg" },
    ]),
  },
  barSweets: {
    title: "حلويات البار",
    items: withDefaultActive([
      { name: "كريب شوكولاتة", price: 15, image: "/menu/bar/16.jpg" },
      {
        name: "كريب (نوتيلا / بيستاشيو / لوتس)",
        price: 25,
        image: "/menu/bar/64.jpg",
      },
      { name: "كريب دبي", price: 30, image: "/menu/bar/14.jpg" },
      {
        name: "بان كيك",
        price: 30,
        desc: "نوتيلا / بيستاشيو / لوتس",
        image: "/menu/bar/13.jpg",
      },
      { name: "رينجز", price: 25, image: "/menu/bar/56.jpg" },
      { name: "لقيمات شوكولاتة", price: 15, image: "/menu/bar/15.jpg" },
      {
        name: "لقيمات (نوتيلا / بيستاشيو / لوتس)",
        price: 25,
        image: "/menu/bar/55.jpg",
      },
      {
        name: "بان كيك شوكولاتة",
        price: 15,
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      },
      { name: "مولتن كيك", price: 20, image: "/menu/bar/37.jpg" },
      { name: "هوت كيك", price: 20, image: "/menu/bar/59.jpg" },
      { name: "براونيز", price: 20, image: "/menu/bar/38.jpg" },
      { name: "ترياكي", price: 25, image: "/menu/bar/38.jpg" },
      {
        name: "ميني فيشز",
        price: 25,
        image: "/menu/bar/38.jpg",
        desc: "نوتيلا / بيستاشيو / لوتس",
      },
      {
        name: "ميني بان كيك",
        price: 25,
        image: "/menu/bar/38.jpg",
        desc: "نوتيلا / بيستاشيو / لوتس",
      },
      {
        name: "وافل ستيك",
        price: 25,
        image: "/menu/bar/38.jpg",
        desc: "نوتيلا / بيستاشيو / لوتس",
      },
      { name: "كنافة نويتلا", price: 15, image: "/menu/bar/58.jpg" },
    ]),
  },
  gelato: {
    title: "الجيلاتو",
    items: withDefaultActive([
      {
        name: "جيلاتو نوتيلا",
        price: 15,
        image: "/menu/Gelato/70.jpeg",
      },
      {
        name: "جيلاتو بستاشيو",
        price: 15,
        image: "/menu/Gelato/72.jpeg",
      },
      {
        name: "جيلاتو لوتس",
        price: 15,
        image: "/menu/Gelato/70.jpeg",
      },
      {
        name: "جيلاتو كيندر",
        price: 15,
        image: "/menu/Gelato/70.jpeg",
      },
      {
        name: "جيلاتو بلوبيري",
        price: 15,
        image: "/menu/Gelato/79.jpeg",
      },
      {
        name: "جيلاتو عربية",
        price: 15,
        image: "/menu/Gelato/75.jpeg",
      },
    ]),
  },
  drinks: {
    title: "المشروبات",
    items: withDefaultActive([
       { name: "عصير الموسم", price: 10, image: "/menu/drinks/1.jpg" },
      { name: "عصير أناناس", price: 12, image: "/menu/drinks/2.jpg" },
      { name: "ليمون ونعنع", price: 10, image: "/menu/drinks/3.jpg" },
      { name: "أفوكادو", price: 15, image: "/menu/drinks/4.jpg" },
      { name: "شوكو بارد", price: 10, image: "/menu/drinks/7.jpg" },
      { name: "ايس موكا", price: 10, image: "/menu/drinks/5.jpg" },
      { name: "آيس كافي", price: 10, image: "/menu/drinks/10.jpg" },
      { name: "ميلك شيك", price: 15, image: "/menu/drinks/8.jpg" },
      { name: "موهيتو", price: 20, image: "/menu/drinks/16.jpg" },
      { name: "آيس كريم", price: 10, image: "/menu/drinks/14.jpg" },
      { name: "براد", price: 5, image: "/menu/drinks/15.jpg" },
      { name: "نسكافيه", price: 5, image: "/menu/drinks/9.jpg" },
      { name: "كابتشينو", price: 5, image: "/menu/drinks/9.jpg" },
      { name: "اسبريسو سينجل", price: 5, image: "/menu/drinks/6.jpg" },
      { name: "اسبريسو دبل", price: 10, image: "/menu/drinks/6.jpg" },
      { name: " قهوة تركي سينجل", price: 5, image: "/menu/drinks/6.jpg" },
      { name: "قهوة تركي دبل", price: 10, image: "/menu/drinks/6.jpg" },
      { name: "شاي", price: 3, image: "/menu/drinks/11.jpg" },
      { name: "بلو", price: 4, image: "/menu/drinks/17.jpg" },
      { name: "كوكا كولا", price: 5, image: "/menu/drinks/18.jpg" },
      { name: "سبرايت", price: 5, image: "/menu/drinks/19.jpg" },
      { name: "مياه معدنية 200 ملم", price: 1, image: "/menu/drinks/12.jpg" },
      { name: "مياه معدنية 500 ملم", price: 2, image: "/menu/drinks/13.jpg" },
    ]),
  },
  salads: {
    title: "السلطات",
    items: withDefaultActive([
      {
        name: "سلطات كبيرة",
        price: 15,
        image: "/menu/salad/1.jpeg",
        desc: "ذرة مايونيز / بيكانتي / تركية / ثومية",
      },
      {
        name: "سلطات وسط",
        price: 10,
        image: "/menu/salad/2.jpeg",
      },
      {
        name: "سلطات صغيرة",
        price: 5,
        image: "/menu/salad/1.jpeg",
      },
      {
        name: "بطاطا كبيرة",
        price: 10,
        image: "/menu/salad/20.jpeg",
      },
      {
        name: "بطاطا صغيرة",
        price: 5,
        image: "/menu/salad/20.jpeg",
      },
    ]),
  },
};

// Middle Branch Menu (initially same as Gaza, but can be modified independently)
const middleMenu: MenuData = {
  shawarma: {
    title: "الشاورما",
    items: [
      { name: "بيتا شاورما", price: 50, image: "/menu/shawarma/54.jpg" },
      { name: "شاورما عادي", price: 15, image: "/menu/shawarma/48.jpg" },
      { name: "فرشوحه دبل", price: 17, image: "/menu/shawarma/5O1A7108.jpg" },
      {
        name: "فرشوحه دبل لحمة",
        price: 23,
        image: "/menu/shawarma/5O1A7124.jpg",
      },
      {
        name: "فرشوحه دبل دبل",
        price: 25,
        image:
          "https://images.unsplash.com/photo-1542574271-7f3b92e6c821?w=800&q=80",
        delivery: false,
      },
      { name: "سوري", price: 35, image: "/menu/shawarma/53.jpg" },
      {
        name: "صفيحة",
        price: 38,
        desc: "شاورما - جبنة - زيتون اسود",
        image: "/menu/shawarma/51.jpg",
      },
      {
        name: "باشكا",
        price: 40,
        desc: "خبزة باشكا - شاورما - جبنة - زيتون - صوص بيكانتي",
        image: "/menu/shawarma/18.jpg",
      },
      {
        name: "شاورما عربي",
        price: 38,
        desc: "قطع شاورما - جبنة - زيتون اسود",
        image: "/menu/shawarma/17.jpg",
      },
      {
        name: "شاورما نابلسي",
        price: 38,
        desc: "شاورما - بطاطا - صوص بيكانتي - جبنة - زيتون اسود",
        image: "/menu/shawarma/19.jpg",
      },
      { name: "صحن شاورما كبير", price: 30, image: "/menu/shawarma/14.jpg" },
      { name: "صحن شاورما صغير", price: 20, image: "/menu/shawarma/13.jpg" },
    ],
  },
  italian: gazaMenu.italian,
  sandwiches: gazaMenu.sandwiches,
  easternSweets: gazaMenu.easternSweets,
  westernSweets: gazaMenu.westernSweets,
  barSweets: gazaMenu.barSweets,
  drinks: gazaMenu.drinks,
  salads: gazaMenu.salads,
};

// Main branch-specific menu data export
export const branchMenuData: BranchMenuData = {
  gaza: gazaMenu,
  middle: middleMenu,
};

/**
 * Get menu data for a specific branch
 * @param branch - Branch ID (gaza or middle)
 * @returns Menu data for the specified branch
 */
export function getMenuByBranch(branch: string): MenuData {
  return branchMenuData[branch] || branchMenuData.gaza;
}

/**
 * Get a specific category menu for a branch
 * @param branch - Branch ID
 * @param categoryId - Category ID
 * @returns Menu category for the specified branch and category
 */
export function getCategoryByBranch(
  branch: string,
  categoryId: string
): MenuCategory | null {
  const menu = getMenuByBranch(branch);
  return menu[categoryId] || null;
}
