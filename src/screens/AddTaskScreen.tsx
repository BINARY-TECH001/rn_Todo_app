import { useState } from "react";
import {
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTaskStore } from "../store/taskStore";
import { useColors } from "../theme/color";
import { Task } from "../types/tasks";
import { format } from "date-fns";

// Define category icons and colors locally
type MCIIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
const categoryIcons: Record<Task['category'], MCIIconName> = {
  note: 'note-outline',
  event: 'calendar-outline',
  goal: 'trophy-outline',
};

const categoryColors: Record<Task["category"], string> = {
  note: "#AEC6CF",
  event: "#D7BDE2",
  goal: "#F7DC6F",
};

// Prop interfaces
interface TextProps {
  color: string;
}

interface InputProps {
  color: string;
  background: string;
}

interface CategoryButtonProps {
  selected: boolean;
  background: string;
}

interface PickerButtonProps {
  background: string;
}

interface SaveButtonProps {
  background: string;
}

// Styled components with explicit prop types
const Title = styled.Text<TextProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${({ color }: { color: string }) => color};
`;

// Ensure Content takes available space
const Content = styled.View`
  padding: 16px;
  flex: 1;
`;

const Label = styled.Text<TextProps>`
  font-size: 14px;
  color: ${({ color }: { color: string }) => color};
  margin-bottom: 8px;
`;

const Input = styled.TextInput<InputProps>`
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ background }: { background: string }) => background};
  color: ${({ color }: { color: string }) => color};
  margin-bottom: 16px;
`;

const CategoryContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 16px;
`;

const CategoryButton = styled.TouchableOpacity<CategoryButtonProps>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  background-color: ${({ background }: { background: string }) => background};
  opacity: ${({ selected }: { selected: boolean }) => (selected ? 1 : 0.5)};
`;

const Row = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

const PickerButton = styled.TouchableOpacity<PickerButtonProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ background }: { background: string }) => background};
`;

const NotesInput = styled(Input)`
  height: 100px;
  text-align-vertical: top;
`;

const SaveButton = styled.TouchableOpacity<SaveButtonProps>`
  margin: 16px;
  padding: 16px;
  border-radius: 24px;
  background-color: ${({ background }: { background: string }) => background};
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const PickerText = styled.Text<TextProps>`
  font-size: 16px;
  color: ${({ color }: { color: string }) => color};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  justify-content: center;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  left: 16px;
`;

function AddTaskScreen() {
  const navigation = useNavigation();
  const colors = useColors();
  const addTask = useTaskStore((state) => state.addTask);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Task["category"]>("note");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!title) return; // Basic validation
    Keyboard.dismiss(); // Dismiss keyboard before navigating
    addTask({
      title,
      category,
      date: date ? format(date, "yyyy-MM-dd") : "",
      time: time ? format(time, "HH:mm") : "",
      notes,
    });
    navigation.goBack();
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) setTime(selectedTime);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["top", "bottom", "left", "right"]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Header>
            <CloseButton
              onPress={() => {
                Keyboard.dismiss();
                navigation.goBack();
              }}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text}
              />
            </CloseButton>
            <Title color={colors.text}>Add New Task</Title>
          </Header>
          <Content>
            <Label color={colors.secondaryText}>Task Title</Label>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor={colors.secondaryText}
              color={colors.text}
              background={colors.card}
              accessibilityLabel="Task title input"
            />
            <Label color={colors.secondaryText}>Category</Label>
            <CategoryContainer>
              {(["note", "event", "goal"] as const).map((cat) => (
                <CategoryButton
                  key={cat}
                  onPress={() => setCategory(cat)}
                  selected={category === cat}
                  background={categoryColors[cat]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: category === cat }}
                >
                  <MaterialCommunityIcons
                    name={categoryIcons[cat]}
                    size={24}
                    color={colors.primary}
                  />
                </CategoryButton>
              ))}
            </CategoryContainer>
            <Row>
              <View style={{ flex: 1 }}>
                <Label color={colors.secondaryText}>Date</Label>
                <PickerButton
                  onPress={() => setShowDatePicker(true)}
                  background={colors.card}
                >
                  <PickerText color={colors.text}>
                    {date ? format(date, "yyyy-MM-dd") : "Date"}
                  </PickerText>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={colors.accent}
                  />
                </PickerButton>
                {showDatePicker && (
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Label color={colors.secondaryText}>Time</Label>
                <PickerButton
                  onPress={() => setShowTimePicker(true)}
                  background={colors.card}
                >
                  <PickerText color={colors.text}>
                    {time ? format(time, "HH:mm") : "Time"}
                  </PickerText>
                  <MaterialCommunityIcons
                    name="clock"
                    size={20}
                    color={colors.accent}
                  />
                </PickerButton>
                {showTimePicker && (
                  <DateTimePicker
                    value={time || new Date()}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                  />
                )}
              </View>
            </Row>
            <Label color={colors.secondaryText}>Notes</Label>
            <NotesInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes"
              placeholderTextColor={colors.secondaryText}
              multiline
              numberOfLines={4}
              color={colors.text}
              background={colors.card}
              accessibilityLabel="Notes input"
              blurOnSubmit={true} // Optional: Dismiss keyboard on "Done"
            />
          </Content>
          <SaveButton
            onPress={handleSave}
            background={colors.primary}
            accessibilityRole="button"
          >
            <ButtonText>Save</ButtonText>
          </SaveButton>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export { AddTaskScreen };
