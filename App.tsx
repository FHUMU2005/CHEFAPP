
import React, { useEffect, useMemo, useState } from "react";
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

type Course = "Starter" | "Mains" | "Dessert";
type Filter = "All" | Course;
type Screen = "splash" | "login" | "menu" | "dishForm" | "checkout" | "thankyou";

type Dish = {
  id: number;
  name: string;
  description: string;
  course: Course;
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
  light: "#FFF4F4",
  gray: "#777777",
  border: "#E8B6B6",
};

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
    course: "Starter",
    price: 125.5,
    image: FOOD_IMAGES.starters,
  },
  {
    id: 2,
    name: "Chicken Special",
    description: "Grilled chicken served with vegetables.",
    course: "Mains",
    price: 189.99,
    image: FOOD_IMAGES.mains,
  },
  {
    id: 3,
    name: "Chef's Dessert",
    description: "Sweet dessert prepared by our chef.",
    course: "Dessert",
    price: 85.5,
    image: FOOD_IMAGES.dessert,
  },
];

const money = (amount: number) =>
  `R ${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const imageForCourse = (course: Course) => {
  if (course === "Starter") return FOOD_IMAGES.starters;
  if (course === "Mains") return FOOD_IMAGES.mains;
  return FOOD_IMAGES.dessert;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");

  const [dishes, setDishes] = useState<Dish[]>(DEFAULT_DISHES);
  const [order, setOrder] = useState<number[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course>("Starter");
  const [price, setPrice] = useState("");

  const [username, setUsername] = useState("");

  // SPLASH SCREEN: 3 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen("login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // SEARCH AND FILTER
  const filteredDishes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return dishes.filter((dish) => {
      const matchesCourse =
        filter === "All" || dish.course === filter;

      const matchesSearch =
        dish.name.toLowerCase().includes(term) ||
        dish.description.toLowerCase().includes(term);

      return matchesCourse && matchesSearch;
    });
  }, [dishes, filter, search]);

  // MENU STATISTICS
  const totalItems = dishes.length;

  const totalMenuPrice = dishes.reduce(
    (sum, dish) => sum + dish.price,
    0
  );

  const averagePrice =
    totalItems > 0 ? totalMenuPrice / totalItems : 0;

  // CHECKOUT INFORMATION
  const orderedDishes = order
    .map((id) => dishes.find((dish) => dish.id === id))
    .filter((dish): dish is Dish => Boolean(dish));

  const orderTotal = orderedDishes.reduce(
    (sum, dish) => sum + dish.price,
    0
  );

  // LOGIN
  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert("Login", "Please enter your name.");
      return;
    }

    setScreen("menu");
  };

  // OPEN ADD DISH FORM
  const openAddForm = () => {
    setEditingId(null);
    setDishName("");
    setDescription("");
    setCourse("Starter");
    setPrice("");
    setScreen("dishForm");
  };

  // OPEN EDIT DISH FORM
  const openEditForm = (dish: Dish) => {
    setEditingId(dish.id);
    setDishName(dish.name);
    setDescription(dish.description);
    setCourse(dish.course);
    setPrice(dish.price.toString());
    setScreen("dishForm");
  };

  // SAVE NEW OR EDITED DISH
  const saveDish = () => {
    const cleanName = dishName.trim();
    const cleanDescription = description.trim();
    const cleanPrice = Number(price.replace(",", "."));

    if (!cleanName || !cleanDescription || !price.trim()) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }

    if (!Number.isFinite(cleanPrice) || cleanPrice <= 0) {
      Alert.alert("Invalid price", "Enter a valid price greater than zero.");
      return;
    }

    if (editingId !== null) {
      setDishes((previous) =>
        previous.map((dish) =>
          dish.id === editingId
            ? {
                ...dish,
                name: cleanName,
                description: cleanDescription,
                course,
                price: cleanPrice,
                image: imageForCourse(course),
              }
            : dish
        )
      );

      Alert.alert("Success", "Dish updated successfully!");
    } else {
      const newDish: Dish = {
        id: Date.now(),
        name: cleanName,
        description: cleanDescription,
        course,
        price: cleanPrice,
        image: imageForCourse(course),
      };

      setDishes((previous) => [...previous, newDish]);

      Alert.alert("Success", "New dish added successfully!");
    }

    setScreen("menu");
  };

  // REMOVE DISH
  const removeDish = (id: number) => {
    Alert.alert(
      "Remove Dish",
      "Are you sure you want to remove this dish?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setDishes((previous) =>
              previous.filter((dish) => dish.id !== id)
            );

            setOrder((previous) =>
              previous.filter((itemId) => itemId !== id)
            );

            Alert.alert("Removed", "Dish removed successfully.");
          },
        },
      ]
    );
  };

  // ADD OR REMOVE DISH FROM ORDER
  const toggleOrder = (id: number) => {
    setOrder((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  };

  // PLACE ORDER
  const placeOrder = () => {
    if (orderedDishes.length === 0) {
      Alert.alert("Empty order", "Please select at least one dish.");
      return;
    }

    setScreen("thankyou");
  };

  // REUSABLE BUTTON
  const ActionButton = ({
    title,
    onPress,
    color = COLORS.red,
  }: {
    title: string;
    onPress: () => void;
    color?: string;
  }) => (
    <Pressable
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );

  // SPLASH SCREEN
  if (screen === "splash") {
    return (
      <SafeAreaView style={styles.splash}>
        <StatusBar barStyle="light-content" />
        <Image source={{ uri: FOOD_IMAGES.chef }} style={styles.chefImage} />
        <Text style={styles.splashTitle}>CHEF'S KITCHEN</Text>
        <Text style={styles.splashSubtitle}>
          Delicious meals, prepared with love.
        </Text>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // LOGIN SCREEN
  if (screen === "login") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.red} barStyle="light-content" />
        <KeyboardAvoidingView
          style={styles.center}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Image source={{ uri: FOOD_IMAGES.chef }} style={styles.loginImage} />
          <Text style={styles.heading}>Welcome to Chef's Kitchen</Text>
          <Text style={styles.subtitle}>
            Please enter your name to continue.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={username}
            onChangeText={setUsername}
          />

          <ActionButton title="LOGIN" onPress={handleLogin} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ADD AND EDIT DISH SCREEN
  if (screen === "dishForm") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.red} barStyle="light-content" />

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>
            {editingId !== null ? "Edit Dish" : "Add New Dish"}
          </Text>

          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter dish description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Select Course</Text>

          <View style={styles.courseOptions}>
            {(["Starter", "Mains", "Dessert"] as Course[]).map((item) => (
              <Pressable
                key={item}
                onPress={() => setCourse(item)}
                style={[
                  styles.courseButton,
                  course === item && styles.selectedCourse,
                ]}
              >
                <Text
                  style={[
                    styles.courseButtonText,
                    course === item && styles.selectedCourseText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price e.g. 150.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />

          <ActionButton
            title={editingId !== null ? "UPDATE DISH" : "SAVE DISH"}
            onPress={saveDish}
          />

          <ActionButton
            title="CANCEL"
            color={COLORS.gray}
            onPress={() => setScreen("menu")}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // CHECKOUT SCREEN
  if (screen === "checkout") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>Your Order</Text>

          {orderedDishes.length === 0 ? (
            <Text style={styles.emptyText}>Your order is empty.</Text>
          ) : (
            orderedDishes.map((dish) => (
              <View key={dish.id} style={styles.checkoutItem}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.price}>{money(dish.price)}</Text>
                <Pressable onPress={() => toggleOrder(dish.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}

          <View style={styles.totalBox}>
            <Text style={styles.totalText}>
              Total: {money(orderTotal)}
            </Text>
          </View>

          <ActionButton title="PLACE ORDER" onPress={placeOrder} />

          <ActionButton
            title="BACK TO MENU"
            color={COLORS.gray}
            onPress={() => setScreen("menu")}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // THANK YOU SCREEN
  if (screen === "thankyou") {
    return (
      <SafeAreaView style={styles.splash}>
        <Text style={styles.thankyouTitle}>Thank You!</Text>
        <Text style={styles.splashSubtitle}>
          Your order has been placed successfully.
        </Text>

        <Text style={styles.totalText}>
          Order Total: {money(orderTotal)}
        </Text>

        <ActionButton
          title="BACK TO MENU"
          color={COLORS.green}
          onPress={() => {
            setOrder([]);
            setScreen("menu");
          }}
        />
      </SafeAreaView>
    );
  }

  // MAIN MENU SCREEN
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.red} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>CHEF'S KITCHEN</Text>
        <Text style={styles.welcome}>Welcome, {username}!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        <Text style={styles.heading}>Dish Management</Text>

        {/* STATISTICS */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: COLORS.red }]}>
            <Text style={styles.statNumber}>{totalItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: COLORS.blue }]}>
            <Text style={styles.statNumber}>
              {money(totalMenuPrice)}
            </Text>
            <Text style={styles.statLabel}>Total Price</Text>
          </View>

          <View
            style={[styles.statCard, { backgroundColor: COLORS.green }]}
          >
            <Text style={styles.statNumber}>
              {money(averagePrice)}
            </Text>
            <Text style={styles.statLabel}>Average Price</Text>
          </View>
        </View>

        {/* SEARCH */}
        <TextInput
          style={styles.input}
          placeholder="Search dishes by name or description..."
          value={search}
          onChangeText={setSearch}
        />

        {/* COURSE FILTER */}
        <Text style={styles.label}>Filter by Course</Text>

        <View style={styles.filterContainer}>
          {(["All", "Starter", "Mains", "Dessert"] as Filter[]).map(
            (item) => (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={[
                  styles.filterButton,
                  filter === item && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )
          )}
        </View>

        {/* ADD DISH */}
        <ActionButton title="+ ADD NEW DISH" onPress={openAddForm} />

        <Text style={styles.sectionTitle}>
          Available Dishes ({filteredDishes.length})
        </Text>

        {/* DISH LIST */}
        {filteredDishes.length === 0 ? (
          <Text style={styles.emptyText}>
            No dishes found. Try another search or filter.
          </Text>
        ) : (
          filteredDishes.map((dish) => {
            const isSelected = order.includes(dish.id);

            return (
              <View key={dish.id} style={styles.dishCard}>
                <Image
                  source={{ uri: dish.image }}
                  style={styles.dishImage}
                />

                <View style={styles.dishDetails}>
                  <Text style={styles.dishName}>{dish.name}</Text>

                  <Text style={styles.description}>
                    {dish.description}
                  </Text>

                  <Text style={styles.courseText}>
                    Course: {dish.course}
                  </Text>

                  <Text style={styles.price}>
                    {money(dish.price)}
                  </Text>

                  <View style={styles.actionRow}>
                    <Pressable
                      style={[styles.smallButton, { backgroundColor: COLORS.blue }]}
                      onPress={() => openEditForm(dish)}
                    >
                      <Text style={styles.smallButtonText}>EDIT</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.smallButton, { backgroundColor: COLORS.red }]}
                      onPress={() => removeDish(dish.id)}
                    >
                      <Text style={styles.smallButtonText}>REMOVE</Text>
                    </Pressable>
                  </View>

                  <Pressable
                    style={[
                      styles.orderButton,
                      {
                        backgroundColor: isSelected
                          ? COLORS.gray
                          : COLORS.green,
                      },
                    ]}
                    onPress={() => toggleOrder(dish.id)}
                  >
                    <Text style={styles.smallButtonText}>
                      {isSelected ? "REMOVE FROM ORDER" : "ADD TO ORDER"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* MENU SUMMARY */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Menu Summary</Text>
          <Text style={styles.summaryText}>
            Total dishes: {totalItems}
          </Text>
          <Text style={styles.summaryText}>
            Total menu value: {money(totalMenuPrice)}
          </Text>
          <Text style={styles.summaryText}>
            Average dish price: {money(averagePrice)}
          </Text>
          <Text style={styles.summaryText}>
            Selected order items: {orderedDishes.length}
          </Text>
        </View>

        <ActionButton
          title={`CHECKOUT (${order.length})`}
          color={COLORS.turquoise}
          onPress={() => setScreen("checkout")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },

  splash: {
    flex: 1,
    backgroundColor: COLORS.red,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  chefImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 25,
  },

  loginImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 25,
  },

  splashTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  splashSubtitle: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  loading: {
    color: COLORS.white,
    marginTop: 30,
    fontSize: 16,
  },

  thankyouTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 15,
  },

  header: {
    backgroundColor: COLORS.red,
    padding: 20,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 23,
    color: COLORS.white,
    fontWeight: "bold",
  },

  welcome: {
    color: COLORS.white,
    marginTop: 5,
    fontSize: 15,
  },

  menuContainer: {
    padding: 15,
    paddingBottom: 40,
  },

  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 23,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 18,
  },

  subtitle: {
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: "center",
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    minWidth: 95,
    minHeight: 90,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },

  statLabel: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 13,
    marginBottom: 15,
    fontSize: 15,
    color: COLORS.black,
  },

  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.black,
  },

  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 15,
  },

  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 15,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: COLORS.red,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: COLORS.red,
  },

  filterText: {
    color: COLORS.red,
    fontWeight: "bold",
  },

  activeFilterText: {
    color: COLORS.white,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 12,
    color: COLORS.black,
  },

  dishCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    elevation: 3,
  },

  dishImage: {
    width: "100%",
    height: 170,
    borderRadius: 9,
    marginBottom: 10,
  },

  dishDetails: {
    padding: 3,
  },

  dishName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 5,
  },

  description: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 7,
  },

  courseText: {
    color: COLORS.blue,
    fontWeight: "bold",
    marginBottom: 5,
  },

  price: {
    color: COLORS.green,
    fontWeight: "bold",
    fontSize: 17,
    marginVertical: 5,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  smallButton: {
    flex: 1,
    padding: 11,
    borderRadius: 6,
    alignItems: "center",
  },

  smallButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },

  orderButton: {
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
    marginTop: 10,
  },

  courseOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  courseButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 8,
  },

  selectedCourse: {
    backgroundColor: COLORS.red,
  },

  courseButtonText: {
    color: COLORS.red,
    fontWeight: "bold",
  },

  selectedCourseText: {
    color: COLORS.white,
  },

  summaryBox: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  summaryTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 10,
  },

  summaryText: {
    fontSize: 15,
    marginBottom: 7,
    color: COLORS.black,
  },

  emptyText: {
    color: COLORS.gray,
    textAlign: "center",
    margin: 20,
    fontSize: 15,
  },

  checkoutItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  removeText: {
    color: COLORS.red,
    fontWeight: "bold",
    marginTop: 8,
  },

  totalBox: {
    backgroundColor: COLORS.light,
    padding: 15,
    marginVertical: 15,
    borderRadius: 8,
  },

  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginVertical: 10,
  },
});
