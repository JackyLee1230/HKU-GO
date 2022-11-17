import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";
import {
	Bubble,
	GiftedChat,
	SystemMessage,
	IMessage,
	Send,
	SendProps,
} from "react-native-gifted-chat";
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	deleteDoc,
	updateDoc,
	doc,
	setDoc,
	orderBy,
	onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { Modal, Portal, RadioButton, TextInput, ActivityIndicator } from "react-native-paper";

const filterBotMessages = (message) =>
	!message.system && message.user && message.user._id && message.user._id === 2;
const findStep = (step) => (message) => message._id === step;

export default function ChatScreen({ navigation }) {
	const [loadEarlier, setLoadEarlier] = useState(true);
	const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [messages, setMessages] = useState([]);
	const [visible, setVisible] = useState(false);
	const [userInfo, setUserInfo] = useState([]);
	const [userName, setUserName] = useState("");
	const [loadingIndication, setLoadingIndication] = useState(false);

	const showModal = () => {
		setVisible(true);
	};

	const hideModal = () => {
		setVisible(false);
	};

	// get user data with userid == clickUserID
	const getUserData = async (id, name) => {
		await setUserName(name);
		const q = query(collection(db, "points"), where("uid", "==", id));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			setUserInfo(doc.data());
			console.log(doc.data());
		});
	};

	useEffect(() => {
		const collectionRef = collection(db, "chats");
		const q = query(collectionRef, orderBy("createdAt", "desc"));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			setMessages(
				querySnapshot.docs.map((doc) => ({
					_id: doc.data()._id,
					createdAt: doc.data().createdAt.toDate(),
					text: doc.data().text,
					user: doc.data().user,
				}))
			);
		});

		return () => unsubscribe();
	}, []);

	const onSend = useCallback((messages = []) => {
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, messages)
		);
		const { _id, createdAt, text, user } = messages[0];
		addDoc(collection(db, "chats"), {
			_id,
			createdAt,
			text,
			user,
		});
	}, []);

	const renderBubble = (props) => {
		return <Bubble {...props} />;
	};

	const renderSend = (props) => (
		<Send {...props} containerStyle={{ justifyContent: "center" }}>
			<MaterialIcons size={30} color={"tomato"} name={"send"} />
		</Send>
	);

	return (
		<View style={styles.container}>
			{loadingIndication &&
				<View style={{
					position: "absolute",
					zIndex: 1,
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#F5FCFF88",
				}}>
					<ActivityIndicator
						color={"#47B5FF"}
						size={"large"}
					/>
				</View>
			}


			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={{
						backgroundColor: "white",
						padding: 20,
						paddingVertical: 40,
						marginHorizontal: 64,
						borderRadius: 8,
						elevation: 10,
						shadowColor: "#171717",
					}}
				>
					<View style={{ justifyContent: "center", alignItems: "center" }}>
						<Image
							style={styles.userImg}
							source={{
								uri: userInfo
									? auth?.currentUser?.userImg ||
									  "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
									: "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
							}}
						/>
						<Text style={{color: "#06283D", fontSize: 16, marginBottom: 8, marginTop: 24}}>Username: {userName ?? "N/A"}</Text>

						<Text style={{color: "#06283D", fontSize: 16, marginBottom: 8}}>
							Events: {(userInfo.events && userInfo.events.length) ?? "0"}{" "}
							Registered
						</Text>
						<Text style={{color: "#06283D", fontSize: 16, marginBottom: 24}}>Points: {userInfo.points ?? 0}</Text>
					</View>
					<Button
						title="Close"
						color="#47B5FF"
						onPress={() => {
							hideModal();
						}}
					></Button>
				</Modal>
			</Portal>
			<GiftedChat
				messages={messages}
				onSend={onSend}
				loadEarlier={loadEarlier}
				isLoadingEarlier={isLoadingEarlier}
				scrollToBottom
				onLongPressAvatar= {async(user) => {
					setLoadingIndication(true);
					await getUserData(user._id);
					setLoadingIndication(false);
					showModal();
				}}
				onPressAvatar={async(user) => {
					setLoadingIndication(true);
					await getUserData(user._id, user.name);
					setLoadingIndication(false);
					showModal();
				}}
				user={{
					_id: auth.currentUser.uid,
					name: auth.currentUser.displayName,
					avatar:
						auth.currentUser.userImg ??
						"https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
				}}
				keyboardShouldPersistTaps="never"
				renderBubble={renderBubble}
				renderSend={renderSend}
				quickReplyStyle={{ borderRadius: 2 }}
				quickReplyTextStyle={{
					fontWeight: "200",
				}}
				showUserAvatar={true}
				maxInputLength={500}
				timeTextStyle={{ left: { color: "red" }, right: { color: "yellow" } }}
				isTyping={isTyping}
				infiniteScroll
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	userImg: {
		height: 150,
		width: 150,
		borderRadius: 75,
		marginBottom: "3%",
	},
	userName: {
		fontSize: 26,
		marginTop: 10,
		marginBottom: 10,
	},
	aboutUser: {
		fontSize: 12,
		fontWeight: "600",
		color: "#666",
		textAlign: "center",
		marginBottom: 10,
	},
});
