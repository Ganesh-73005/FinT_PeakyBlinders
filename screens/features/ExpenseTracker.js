import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

const ExpenseTracker = ({ user_id }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [timeFrame, setTimeFrame] = useState("week");
    const [expenses, setExpenses] = useState({
        week: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
            total: 0,
            categories: [],
            transactions: [],
        },
        month: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{ data: [0, 0, 0, 0] }],
            total: 0,
            categories: [],
            transactions: [],
        },
        year: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0] }],
            total: 0,
            categories: [],
            transactions: [],
        },
    });

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/expenses/${user_id}`);
                const fetchedExpenses = response.data;

                // Process expenses for different time frames
                const processedExpenses = {
                    week: processExpenses(fetchedExpenses, "week"),
                    month: processExpenses(fetchedExpenses, "month"),
                    year: processExpenses(fetchedExpenses, "year"),
                };

                setExpenses(processedExpenses);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchExpenses();
    }, [user_id]);

    const processExpenses = (expenses, timeFrame) => {
        const now = new Date();
        const filteredExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            switch (timeFrame) {
                case "week":
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    return expenseDate >= startOfWeek;
                case "month":
                    return expenseDate.getMonth() === now.getMonth();
                case "year":
                    return expenseDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });

        const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const categories = calculateCategories(filteredExpenses);
        const transactions = filteredExpenses.map((expense) => ({
            id: expense._id,
            shopName: expense.shopName,
            date: new Date(expense.date).toLocaleDateString(),
            amount: expense.amount,
            category: expense.category,
        }));

        return {
            labels: timeFrame === "week" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] :
                timeFrame === "month" ? ["Week 1", "Week 2", "Week 3", "Week 4"] :
                    ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ data: calculateDataset(filteredExpenses, timeFrame) }],
            total,
            categories,
            transactions,
        };
    };

    const calculateCategories = (expenses) => {
        const categoryMap = {};
        expenses.forEach((expense) => {
            if (!categoryMap[expense.category]) {
                categoryMap[expense.category] = { amount: 0, count: 0 };
            }
            categoryMap[expense.category].amount += expense.amount;
            categoryMap[expense.category].count += 1;
        });

        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        return Object.keys(categoryMap).map((category) => ({
            name: category,
            amount: categoryMap[category].amount,
            percentage: Math.round((categoryMap[category].amount / totalAmount) * 100),
            icon: getCategoryIcon(category),
        }));
    };

    const calculateDataset = (expenses, timeFrame) => {
        const dataset = Array(timeFrame === "week" ? 7 : timeFrame === "month" ? 4 : 6).fill(0);
        expenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const index = timeFrame === "week" ? expenseDate.getDay() :
                timeFrame === "month" ? Math.floor((expenseDate.getDate() - 1) / 7) :
                    expenseDate.getMonth();
            dataset[index] += expense.amount;
        });
        return dataset;
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Groceries":
                return "food-apple";
            case "Electronics":
                return "laptop";
            case "Clothing":
                return "tshirt-crew";
            case "Stationery":
                return "pencil";
            default:
                return "food-fork-drink";
        }
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
        strokeWidth: 2,
        decimalPlaces: 0,
    };

    const renderCategoryItem = ({ item }) => (
        <View style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
                <MaterialCommunityIcons name={item.icon} size={24} color="#6200ee" />
            </View>
            <View style={styles.categoryDetails}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <View style={styles.categoryBar}>
                    <View style={[styles.categoryProgress, { width: `${item.percentage}%` }]} />
                </View>
            </View>
            <View style={styles.categoryAmount}>
                <Text style={styles.categoryAmountValue}>₹{item.amount}</Text>
                <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
            </View>
        </View>
    );

    const renderTransactionItem = ({ item }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
                <MaterialCommunityIcons
                    name={getCategoryIcon(item.category)}
                    size={24}
                    color="#6200ee"
                />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{item.shopName}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text style={styles.transactionAmount}>₹{item.amount}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Expense Tracker</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "overview" && styles.activeTab]}
                    onPress={() => setActiveTab("overview")}
                >
                    <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "categories" && styles.activeTab]}
                    onPress={() => setActiveTab("categories")}
                >
                    <Text style={[styles.tabText, activeTab === "categories" && styles.activeTabText]}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "transactions" && styles.activeTab]}
                    onPress={() => setActiveTab("transactions")}
                >
                    <Text style={[styles.tabText, activeTab === "transactions" && styles.activeTabText]}>Transactions</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.timeFrameSelector}>
                <TouchableOpacity
                    style={[styles.timeFrameOption, timeFrame === "week" && styles.activeTimeFrame]}
                    onPress={() => setTimeFrame("week")}
                >
                    <Text style={[styles.timeFrameText, timeFrame === "week" && styles.activeTimeFrameText]}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.timeFrameOption, timeFrame === "month" && styles.activeTimeFrame]}
                    onPress={() => setTimeFrame("month")}
                >
                    <Text style={[styles.timeFrameText, timeFrame === "month" && styles.activeTimeFrameText]}>Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.timeFrameOption, timeFrame === "year" && styles.activeTimeFrame]}
                    onPress={() => setTimeFrame("year")}
                >
                    <Text style={[styles.timeFrameText, timeFrame === "year" && styles.activeTimeFrameText]}>Year</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === "overview" && (
                    <View style={styles.overviewContainer}>
                        <View style={styles.totalExpense}>
                            <Text style={styles.totalExpenseLabel}>Total Expenses</Text>
                            <Text style={styles.totalExpenseValue}>₹{expenses[timeFrame].total}</Text>
                        </View>

                        <View style={styles.chartContainer}>
                            <LineChart
                                data={{
                                    labels: expenses[timeFrame].labels,
                                    datasets: expenses[timeFrame].datasets,
                                }}
                                width={screenWidth - 32}
                                height={220}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.chart}
                            />
                        </View>

                        <View style={styles.topCategories}>
                            <Text style={styles.sectionTitle}>Top Categories</Text>
                            {expenses[timeFrame].categories.slice(0, 3).map((category, index) => (
                                <View key={index} style={styles.topCategoryItem}>
                                    <View style={styles.categoryIcon}>
                                        <MaterialCommunityIcons name={category.icon} size={24} color="#6200ee" />
                                    </View>
                                    <View style={styles.categoryDetails}>
                                        <Text style={styles.categoryName}>{category.name}</Text>
                                        <View style={styles.categoryBar}>
                                            <View style={[styles.categoryProgress, { width: `${category.percentage}%` }]} />
                                        </View>
                                    </View>
                                    <View style={styles.categoryAmount}>
                                        <Text style={styles.categoryAmountValue}>₹{category.amount}</Text>
                                        <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {activeTab === "categories" && (
                    <View style={styles.categoriesContainer}>
                        <FlatList
                            data={expenses[timeFrame].categories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.name}
                            scrollEnabled={false}
                        />
                    </View>
                )}

                {activeTab === "transactions" && (
                    <View style={styles.transactionsContainer}>
                        <FlatList
                            data={expenses[timeFrame].transactions}
                            renderItem={renderTransactionItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 16,
        backgroundColor: "#fff",
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        color: "#333",
    },
    tabs: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#6200ee",
    },
    tabText: {
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    activeTabText: {
        color: "#6200ee",
    },
    timeFrameSelector: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#fff",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    timeFrameOption: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginHorizontal: 8,
    },
    activeTimeFrame: {
        backgroundColor: "#6200ee",
    },
    timeFrameText: {
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    activeTimeFrameText: {
        color: "#fff",
    },
    content: {
        flex: 1,
    },
    overviewContainer: {
        padding: 16,
    },
    totalExpense: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
    },
    totalExpenseLabel: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    totalExpenseValue: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        color: "#6200ee",
    },
    chartContainer: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
        alignItems: "center",
    },
    chart: {
        borderRadius: 8,
        marginVertical: 8,
    },
    topCategories: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        marginBottom: 16,
    },
    topCategoryItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    categoriesContainer: {
        padding: 16,
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f0e6ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    categoryDetails: {
        flex: 1,
    },
    categoryName: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        marginBottom: 4,
    },
    categoryBar: {
        height: 6,
        backgroundColor: "#eee",
        borderRadius: 3,
        overflow: "hidden",
    },
    categoryProgress: {
        height: "100%",
        backgroundColor: "#6200ee",
    },
    categoryAmount: {
        alignItems: "flex-end",
    },
    categoryAmountValue: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        color: "#6200ee",
    },
    categoryPercentage: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    transactionsContainer: {
        padding: 16,
    },
    transactionItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f0e6ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionName: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
    },
    transactionCategory: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    transactionDate: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#888",
    },
    transactionAmount: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        color: "#6200ee",
    },
});

export default ExpenseTracker;