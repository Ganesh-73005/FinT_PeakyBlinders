"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const NewsSection = () => {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [refreshing, setRefreshing] = useState(false)
    const [newsLanguage, setNewsLanguage] = useState("english")

    // Mock data for news articles
    const [newsArticles, setNewsArticles] = useState([
        {
            id: "1",
            title: "RBI Introduces New Guidelines for UPI Transactions",
            summary:
                "The Reserve Bank of India has announced new guidelines for UPI transactions to enhance security and prevent fraud.",
            date: "May 15, 2023",
            category: "banking",
            image: "https://via.placeholder.com/300",
            language: "english",
        },
        {
            id: "2",
            title: "New Tax Regulations for Digital Payments",
            summary:
                "The government has introduced new tax regulations for digital payments that will come into effect from June 1, 2023.",
            date: "May 10, 2023",
            category: "tax",
            image: "https://via.placeholder.com/300",
            language: "english",
        },
        {
            id: "3",
            title: "How to Protect Yourself from Online Scams",
            summary: "Learn about the latest online scams and how to protect yourself from becoming a victim.",
            date: "May 8, 2023",
            category: "security",
            image: "https://via.placeholder.com/300",
            language: "english",
        },
        {
            id: "4",
            title: "यूपीआई लेनदेन के लिए आरबीआई ने नए दिशानिर्देश पेश किए",
            summary: "भारतीय रिजर्व बैंक ने सुरक्षा बढ़ाने और धोखाधड़ी को रोकने के लिए यूपीआई लेनदेन के लिए नए दिशानिर्देश की घोषणा की है।",
            date: "May 15, 2023",
            category: "banking",
            image: "https://via.placeholder.com/300",
            language: "hindi",
        },
        {
            id: "5",
            title: "डिजिटल भुगतान के लिए नए कर नियम",
            summary: "सरकार ने डिजिटल भुगतानों के लिए नए कर नियम पेश किए हैं जो 1 जून, 2023 से प्रभावी होंगे।",
            date: "May 10, 2023",
            category: "tax",
            image: "https://via.placeholder.com/300",
            language: "hindi",
        },
        {
            id: "6",
            title: "ஆன்லைன் மோசடிகளில் இருந்து உங்களை எவ்வாறு பாதுகாத்துக் கொள்வது",
            summary: "சமீபத்திய ஆன்லைன் மோசடிகள் மற்றும் நீங்கள் பாதிக்கப்படுவதைத் தடுப்பது எப்படி என்பதைப் பற்றி அறிந்து கொள்ளுங்கள்.",
            date: "May 8, 2023",
            category: "security",
            image: "https://via.placeholder.com/300",
            language: "tamil",
        },
    ])

    const categories = [
        { id: "all", name: "All News" },
        { id: "banking", name: "Banking" },
        { id: "tax", name: "Tax" },
        { id: "security", name: "Security" },
    ]

    const languages = [
        { id: "english", name: "English" },
        { id: "hindi", name: "हिंदी" },
        { id: "tamil", name: "தமிழ்" },
    ]

    const onRefresh = () => {
        setRefreshing(true)
        // Simulate fetching new data
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }

    const filteredNews = newsArticles.filter(
        (article) =>
            (selectedCategory === "all" || article.category === selectedCategory) && article.language === newsLanguage,
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Financial News</Text>
            </View>

            <View style={styles.languageSelector}>
                <Text style={styles.selectorLabel}>Language:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageOptions}>
                    {languages.map((language) => (
                        <TouchableOpacity
                            key={language.id}
                            style={[styles.languageOption, newsLanguage === language.id && styles.selectedLanguage]}
                            onPress={() => setNewsLanguage(language.id)}
                        >
                            <Text style={[styles.languageText, newsLanguage === language.id && styles.selectedLanguageText]}>
                                {language.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.categorySelector}>
                <Text style={styles.selectorLabel}>Category:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryOptions}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.categoryOption, selectedCategory === category.id && styles.selectedCategory]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryText]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.newsContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {filteredNews.length > 0 ? (
                    filteredNews.map((article) => (
                        <TouchableOpacity key={article.id} style={styles.newsItem}>
                            <Image source={{ uri: article.image }} style={styles.newsImage} />
                            <View style={styles.newsContent}>
                                <Text style={styles.newsTitle}>{article.title}</Text>
                                <Text style={styles.newsSummary}>{article.summary}</Text>
                                <View style={styles.newsFooter}>
                                    <Text style={styles.newsDate}>{article.date}</Text>
                                    <View style={styles.categoryTag}>
                                        <Text style={styles.categoryTagText}>
                                            {categories.find((cat) => cat.id === article.category)?.name || article.category}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.noNewsContainer}>
                        <MaterialCommunityIcons name="newspaper-variant-outline" size={64} color="#ccc" />
                        <Text style={styles.noNewsText}>No news available in this language and category.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

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
    languageSelector: {
        padding: 16,
        paddingBottom: 8,
        backgroundColor: "#fff",
    },
    selectorLabel: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        marginBottom: 8,
    },
    languageOptions: {
        flexDirection: "row",
    },
    languageOption: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: "#f0f0f0",
    },
    selectedLanguage: {
        backgroundColor: "#6200ee",
    },
    languageText: {
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    selectedLanguageText: {
        color: "#fff",
    },
    categorySelector: {
        padding: 16,
        paddingTop: 8,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    categoryOptions: {
        flexDirection: "row",
    },
    categoryOption: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: "#f0f0f0",
    },
    selectedCategory: {
        backgroundColor: "#6200ee",
    },
    categoryText: {
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    selectedCategoryText: {
        color: "#fff",
    },
    newsContainer: {
        flex: 1,
        padding: 16,
    },
    newsItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
        elevation: 2,
    },
    newsImage: {
        width: "100%",
        height: 180,
    },
    newsContent: {
        padding: 16,
    },
    newsTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        marginBottom: 8,
    },
    newsSummary: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666",
        marginBottom: 12,
    },
    newsFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    newsDate: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#888",
    },
    categoryTag: {
        backgroundColor: "#f0e6ff",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    categoryTagText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#6200ee",
    },
    noNewsContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
    },
    noNewsText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666",
        textAlign: "center",
        marginTop: 16,
    },
})

export default NewsSection

