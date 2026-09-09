import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

/*
  ============================================================
  CHEF APP
  React Native + TypeScript
  ============================================================

  Screens:
    splash
    login
    menu
    dishForm
    starters
    mains
    dessert
    checkout
    thankyou
*/

type Screen =
  | "splash"
  | "login"
  | "menu"
  | "dishForm"
  | "starters"
  | "mains"
  | "dessert"
  | "checkout"
  | "thankyou";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

const COLORS = {
  red: "#F41418",
  darkRed: "#D9080B",
  turquoise: "#08C9C0",
  blue: "#078AF2",
  green: "#25C94B",
  white: "#FFFFFF",
  black: "#111111",
  lightGray: "#EEEEEE",
};

// Food images.
// You can eventually replace these URLs with local images in /assets.
const FOOD_IMAGES = {
  starters:
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",

  mains:
    "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80",

  dessert:
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80",

  chef:
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_DISHES: Dish[] = [
  {
    id: 1,
    name: "Special Starter",
    description: "Freshly prepared chef's starter.",
    price: 12.5,
    image: FOOD_IMAGES.starters,
  },
  {
    id: 2,
    name: "Chicken Special",
    description: "Grilled chicken served with vegetables.",
    price: 18.99,
    image: FOOD_IMAGES.mains,
  },
  {
    id: 3,
    name: "Chef's Dessert",
    description: "Sweet dessert prepared by our chef.",
    price: 8.5,
    image: FOOD_IMAGES.dessert,
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");

  const [dishes, setDishes] = useState<Dish[]>(DEFAULT_DISHES);

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");

  /*
    ------------------------------------------------------------
    SPLASH SCREEN
    ------------------------------------------------------------
    The splash screen remains visible for approximately 3 seconds.
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen("login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  /*
    ------------------------------------------------------------
    CREATE NEW DISH
    ------------------------------------------------------------
  */

  const createDish = () => {
    if (!dishName || !description || !course || !price) {
      Alert.alert(
        "Missing information",
        "Please complete all of the dish fields."
      );
      return;
    }

    const newDish: Dish = {
      id: Date.now(),
      name: dishName,
      description,
      price: Number(price),
      image:
        course.toLowerCase() === "starter"
          ? FOOD_IMAGES.starters
          : course.toLowerCase() === "mains"
          ? FOOD_IMAGES.mains
          : FOOD_IMAGES.dessert,
    };

    setDishes([...dishes, newDish]);

    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");

    Alert.alert("Dish Created", `${newDish.name} has been added.`);

    if (course.toLowerCase() === "starter") {
      setScreen("starters");
    } else if (course.toLowerCase() === "mains") {
      setScreen("mains");
    } else {
      setScreen("dessert");
    }
  };

  /*
    ------------------------------------------------------------
    LOGIN
    ------------------------------------------------------------
  */

  const handleLogin = () => {
    setScreen("menu");
  };

  /*
    ------------------------------------------------------------
    GET DISHES BY COURSE
    ------------------------------------------------------------
  */

  const starterDishes = dishes.filter(
    (dish) => dish.name.toLowerCase().includes("starter") ||
      dish.description.toLowerCase().includes("starter")
  );

  const mainDishes = dishes.filter(
    (dish) =>
      dish.name.toLowerCase().includes("chicken") ||
      dish.description.toLowerCase().includes("chicken") ||
      dish.name.toLowerCase().includes("main")
  );

  const dessertDishes = dishes.filter(
    (dish) =>
      dish.name.toLowerCase().includes("dessert") ||
      dish.description.toLowerCase().includes("dessert")
  );

  /*
    ============================================================
    SPLASH SCREEN
    ============================================================
  */

  if (screen === "splash") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.red}
          barStyle="light-content"
        />

        <View style={styles.splashContainer}>
          <View style={styles.chefImageWrapper}>
            <Image
              source={{ uri: FOOD_IMAGES.chef }}
              style={styles.chefImage}
            />
          </View>

          <Text style={styles.appTitle}>CHEF APP</Text>

          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
    ============================================================
    LOGIN SCREEN
    ============================================================
  */

  if (screen === "login") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.red}
          barStyle="light-content"
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>CHEF APP</Text>

          <Text style={styles.loginSubtitle}>
            Welcome back, Chef
          </Text>

          <Pressable
            style={[styles.button, styles.yellowButton]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>SIGN IN</Text>
          </Pressable>

          <View style={styles.emptySpace} />

          <Pressable
            style={[styles.button, styles.blueButton]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>

          <NextButton
            onPress={() => setScreen("menu")}
            label="NEXT"
          />
        </View>
      </SafeAreaView>
    );
  }

  /*
    ============================================================
    MENU / COURSE SELECTION
    ============================================================
  */

  if (screen === "menu") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.red}
          barStyle="light-content"
        />

        <ScrollView contentContainerStyle={styles.menuContainer}>
          <MenuCourse
            image={FOOD_IMAGES.starters}
            title="STARTERS"
            color={COLORS.turquoise}
            onPress={() => setScreen("starters")}
          />

          <MenuCourse
            image={FOOD_IMAGES.mains}
            title="MAINS"
            color={COLORS.blue}
            onPress={() => setScreen("mains")}
          />

          <MenuCourse
            image={FOOD_IMAGES.dessert}
            title="DESSERT"
            color={COLORS.green}
            onPress={() => setScreen("dessert")}
          />

          <Pressable
            style={styles.createDishButton}
            onPress={() => setScreen("dishForm")}
          >
            <Text style={styles.buttonText}>CREATE NEW DISH</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
    ============================================================
    DISH FORM
    ============================================================
  */

  if (screen === "dishForm") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.red}
          barStyle="light-content"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.formContainer}>
            <Text style={styles.formTitle}>DISH NAME</Text>

            <TextInput
              value={dishName}
              onChangeText={setDishName}
              placeholder="Enter dish name"
              placeholderTextColor="#777"
              style={styles.input}
            />

            <Text style={styles.formTitle}>DESCRIPTION</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#777"
              multiline
              style={[styles.input, styles.descriptionInput]}
            />

            <Text style={styles.formTitle}>SELECT THE COURSE</Text>

            <View style={styles.courseOptions}>
              <CourseOption
                title="STARTER"
                selected={course === "Starter"}
                color={COLORS.turquoise}
                onPress={() => setCourse("Starter")}
              />

              <CourseOption
                title="MAINS"
                selected={course === "Mains"}
                color={COLORS.blue}
                onPress={() => setCourse("Mains")}
              />

              <CourseOption
                title="DESSERT"
                selected={course === "Dessert"}
                color={COLORS.green}
                onPress={() => setCourse("Dessert")}
              />
            </View>

            <Text style={styles.formTitle}>PRICE</Text>

            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              placeholderTextColor="#777"
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <Pressable
              style={styles.saveButton}
              onPress={createDish}
            >
              <Text style={styles.buttonText}>SAVE DISH</Text>
            </Pressable>

            <Pressable
              style={styles.backButton}
              onPress={() => setScreen("menu")}
            >
              <Text style={styles.buttonText}>BACK</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /*
    ============================================================
    STARTERS
    ============================================================
  */

  if (screen === "starters") {
    return (
      <DishScreen
        title="STARTERS"
        color={COLORS.turquoise}
        dishes={starterDishes.length ? starterDishes : [DEFAULT_DISHES[0]]}
        onNext={() => setScreen("mains")}
        onBack={() => setScreen("menu")}
      />
    );
  }

  /*
    ============================================================
    MAINS
    ============================================================
  */

  if (screen === "mains") {
    return (
      <DishScreen
        title="MAINS"
        color={COLORS.blue}
        dishes={mainDishes.length ? mainDishes : [DEFAULT_DISHES[1]]}
        onNext={() => setScreen("dessert")}
        onBack={() => setScreen("starters")}
      />
    );
  }

  /*
    ============================================================
    DESSERT
    ============================================================
  */

  if (screen === "dessert") {
    return (
      <DishScreen
        title="DESSERT"
        color={COLORS.green}
        dishes={
          dessertDishes.length ? dessertDishes : [DEFAULT_DISHES[2]]
        }
        onNext={() => setScreen("checkout")}
        onBack={() => setScreen("mains")}
      />
    );
  }

  /*
    ============================================================
    CHECKOUT
    ============================================================
  */

  if (screen === "checkout") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.red}
          barStyle="light-content"
        />

        <ScrollView contentContainerStyle={styles.checkoutContainer}>
          <Text style={styles.checkoutTitle}>YOUR ORDER</Text>

          {dishes.slice(0, 3).map((dish) => (
            <View style={styles.orderRow} key={dish.id}>
              <Text style={styles.orderName}>{dish.name}</Text>

              <Text style={styles.orderPrice}>
                ${dish.price.toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>TOTAL</Text>

            <Text style={styles.totalText}>
              $
              {dishes
                .slice(0, 3)
                .reduce((total, dish) => total + dish.price, 0)
                .toFixed(2)}
            </Text>
          </View>

          <Pressable
            style={styles.removeButton}
            onPress={() =>
              Alert.alert(
                "Remove Items",
                "Your order items would be removed here."
              )
            }
          >
            <Text style={styles.buttonText}>REMOVE ITEMS</Text>
          </Pressable>

          <Text style={styles.checkoutMessage}>
            Message
          </Text>

          <Text style={styles.checkoutProceed}>
            PROCEED TO CHECKOUT
          </Text>

          <Pressable
            style={styles.payButton}
            onPress={() => setScreen("thankyou")}
          >
            <Text style={styles.buttonText}>
              PAY WITH MASTER CARD
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
    ============================================================
    THANK YOU SCREEN
    ============================================================
  */

  if (screen === "thankyou") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.red}
          barStyle="light-content"
        />

        <View style={styles.thankYouContainer}>
          <Text style={styles.messageTitle}>Message</Text>

          <Text style={styles.thankYouText}>
            THANK FOR YOUR
          </Text>

          <Text style={styles.thankYouText}>
            PATRONAGE
          </Text>

          <Pressable
            style={styles.orderButton}
            onPress={() => setScreen("menu")}
          >
            <Text style={styles.buttonText}>
              ORDER NO:582
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

/*
================================================================
REUSABLE MENU COMPONENT
================================================================
*/

function MenuCourse({
  image,
  title,
  color,
  onPress,
}: {
  image: string;
  title: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.menuCourse}>
      <Image source={{ uri: image }} style={styles.menuImage} />

      <Pressable
        style={[styles.courseButton, { backgroundColor: color }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </View>
  );
}

/*
================================================================
DISH SCREEN
================================================================
*/

function DishScreen({
  title,
  color,
  dishes,
  onNext,
  onBack,
}: {
  title: string;
  color: string;
  dishes: Dish[];
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.red}
        barStyle="light-content"
      />

      <View style={styles.dishScreen}>
        <Text style={styles.pageTitle}>{title}</Text>

        <ScrollView
          contentContainerStyle={styles.dishScroll}
          showsVerticalScrollIndicator={false}
        >
          {dishes.map((dish) => (
            <View style={styles.dishCard} key={dish.id}>
              <Image
                source={{ uri: dish.image }}
                style={styles.dishImage}
              />

              <Text style={styles.dishName}>{dish.name}</Text>

              <Text style={styles.dishDescription}>
                {dish.description}
              </Text>

              <Text style={styles.dishPrice}>
                ${dish.price.toFixed(2)}
              </Text>

              <Pressable
                style={[styles.courseButton, { backgroundColor: color }]}
                onPress={() => {
                  Alert.alert(
                    "Added",
                    `${dish.name} added to your order.`
                  );
                }}
              >
                <Text style={styles.buttonText}>ADD TO ORDER</Text>
              </Pressable>
            </View>
          ))}

          <View style={styles.navigationRow}>
            <Pressable
              style={styles.smallButton}
              onPress={onBack}
            >
              <Text style={styles.buttonText}>BACK</Text>
            </Pressable>

            <Pressable
              style={styles.smallButton}
              onPress={onNext}
            >
              <Text style={styles.buttonText}>NEXT</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/*
================================================================
NEXT BUTTON
================================================================
*/

function NextButton({
  onPress,
  label = "NEXT",
}: {
  onPress: () => void;
  label?: string;
}) {
  return (
    <Pressable style={styles.nextButton} onPress={onPress}>
      <Text style={styles.nextButtonText}>▶ {label}</Text>
    </Pressable>
  );
}

/*
================================================================
COURSE OPTION
================================================================
*/

function CourseOption({
  title,
  color,
  selected,
  onPress,
}: {
  title: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.courseOption,
        {
          backgroundColor: selected ? color : "#C90003",
          borderWidth: selected ? 3 : 0,
          borderColor: COLORS.white,
        },
      ]}
    >
      <Text style={styles.courseOptionText}>{title}</Text>
    </Pressable>
  );
}

/*
================================================================
STYLES
================================================================
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.red,
  },

  /*
    Splash
  */

  splashContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  chefImageWrapper: {
    width: 180,
    height: 180,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: "#DDD",
    marginBottom: 30,
  },

  chefImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  appTitle: {
    color: COLORS.black,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontSize: 22,
    fontWeight: "800",
  },

  loadingText: {
    marginTop: 25,
    color: COLORS.white,
    fontSize: 16,
  },

  /*
    Login
  */

  loginContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
  },

  loginTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.white,
    marginBottom: 10,
  },

  loginSubtitle: {
    color: COLORS.white,
    fontSize: 17,
    marginBottom: 50,
  },

  button: {
    width: 150,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  yellowButton: {
    backgroundColor: "#FFCC00",
  },

  blueButton: {
    backgroundColor: COLORS.blue,
  },

  emptySpace: {
    height: 50,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },

  nextButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginTop: 60,
  },

  nextButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  /*
    Main menu
  */

  menuContainer: {
    alignItems: "center",
    paddingVertical: 25,
  },

  menuCourse: {
    width: "90%",
    alignItems: "center",
    marginBottom: 25,
  },

  menuImage: {
    width: 180,
    height: 130,
    resizeMode: "cover",
    marginBottom: 15,
  },

  courseButton: {
    width: 160,
    minHeight: 42,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  createDishButton: {
    backgroundColor: COLORS.darkRed,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
  },

  /*
    Form
  */

  formContainer: {
    padding: 20,
    paddingBottom: 50,
  },

  formTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
    marginTop: 18,
  },

  input: {
    backgroundColor: "#D9080B",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: COLORS.white,
    fontSize: 15,
  },

  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },

  courseOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  courseOption: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  courseOptionText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 11,
  },

  saveButton: {
    backgroundColor: COLORS.blue,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35,
  },

  backButton: {
    backgroundColor: "#C90003",
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  /*
    Dish pages
  */

  dishScreen: {
    flex: 1,
  },

  pageTitle: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
    paddingTop: 20,
  },

  dishScroll: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },

  dishCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.red,
    paddingVertical: 20,
    marginBottom: 20,
  },

  dishImage: {
    width: 220,
    height: 170,
    resizeMode: "cover",
    marginBottom: 15,
  },

  dishName: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 7,
  },

  dishDescription: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 25,
    marginBottom: 8,
  },

  dishPrice: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 15,
  },

  navigationRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  smallButton: {
    backgroundColor: COLORS.blue,
    minWidth: 90,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    borderRadius: 25,
  },

  /*
    Checkout
  */

  checkoutContainer: {
    padding: 25,
    alignItems: "center",
  },

  checkoutTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 25,
  },

  orderRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#C90003",
    paddingVertical: 15,
  },

  orderName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  orderPrice: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  totalRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 25,
  },

  totalText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
  },

  removeButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 30,
    width: 160,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  checkoutMessage: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 40,
  },

  checkoutProceed: {
    color: COLORS.black,
    fontSize: 13,
    marginTop: 5,
  },

  payButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 30,
    paddingHorizontal: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },

  /*
    Thank you
  */

  thankYouContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  messageTitle: {
    color: COLORS.black,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 5,
  },

  thankYouText: {
    color: COLORS.black,
    fontSize: 15,
  },

  orderButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: COLORS.blue,
    borderRadius: 30,
    width: 150,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
});
