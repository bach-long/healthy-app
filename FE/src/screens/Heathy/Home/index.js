import React, { memo, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import CustomText from "../../../components/CustomText";
import Layout from "../../../layouts/Layout";
import styles from "./styles";
import WorkoutRecord from "./NavigationItem/WorkoutRecord";
import Target from "./NavigationItem/Target";
import Sleep from "./NavigationItem/Sleep";
import IBMIndex from "./NavigationItem/IBMIndex";
import { useStep } from "../../../providers/StepProvider";
import { useNavigation } from "@react-navigation/native";
import { countTotalSecondStepOfDay } from "../../../data/stepCounter";
import { handleGetBMI } from "../../../services/bmi";
import bmiValues from "../../../constants/bmiValues";
import { getAuthUserProperty } from "../../../data/user";

export default Home = memo(() => {
  const { steps } = useStep();
  const navigation = useNavigation();

  const [time, setTime] = useState(0);
  const [bmi, setBmi] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const ui = await getAuthUserProperty("user_id");
      setUserId(ui[0].user_id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      getBMI();
    }
  }, [userId]);

  const getBMI = async () => {
    const bmiRes = await handleGetBMI(userId);
    if (bmiRes.success) {
      const weight = bmiRes.data?.weight == "null" ? "" : bmiRes.data?.weight;
      const height = bmiRes.data?.height == "null" ? "" : bmiRes.data?.height;
      setBmi({
        weight,
        height,
      });
    }
  };

  const getTotalTime = async () => {
    const res = await countTotalSecondStepOfDay();
    console.log(res);
    setTime(Math.floor(res / 60));
  };

  useEffect(() => {
    getTotalTime();
  }, []);

  const checkLevel = () => {
    if (bmi) {
      const bmiValue = (
        bmi.weight /
        ((bmi.height * bmi.height) / 10000)
      ).toFixed(2);

      for (key in bmiValues) {
        if (
          bmiValue >= bmiValues[key].minValue &&
          bmiValue <= bmiValues[key].maxValue
        ) {
          return (
            <CustomText
              fontFamily="NunitoSans-Bold"
              style={[{ color: bmiValues[key].color }]}
            >
              {bmiValues[key].content}
            </CustomText>
          );
        }
      }
    } else {
      return "---";
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <CustomText style={[styles.title]} fontFamily="NunitoSans-SemiBold">
          Sức khỏe
        </CustomText>

        <View style={styles.topContainer}>
          <View>
            <TouchableOpacity
              style={styles.topCircle}
              onPress={() => navigation.navigate("Footsteps")}
              activeOpacity={1}
            >
              <CustomText style={[{ color: "white" }]}>
                {steps.current?.count}
              </CustomText>
              <CustomText style={[{ color: "white" }]}>bước</CustomText>
            </TouchableOpacity>

            <CustomText style={[{ color: "white", textAlign: "center" }]}>
              {(steps.current.lengthTravel / 1000).toFixed(2)} Km
            </CustomText>
          </View>
          <View>
            <TouchableOpacity
              style={styles.topCircle}
              onPress={() => {}}
              activeOpacity={1}
            >
              <CustomText style={[{ color: "white" }]}>{time}</CustomText>
              <CustomText style={[{ color: "white" }]}>phút</CustomText>
            </TouchableOpacity>
            <CustomText style={[{ color: "white", textAlign: "center" }]}>
              {steps.current.calo.toFixed(2)} kcal
            </CustomText>
          </View>
        </View>

        <ScrollView
          style={{
            margin: -16,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          <View style={{ marginBottom: 16, flexDirection: "row" }}>
            <WorkoutRecord
              distance={(steps.current.lengthTravel / 1000).toFixed(2)}
            />
            <Target />
          </View>
          <View style={{ marginBottom: 16, flexDirection: "row" }}>
            <Sleep />
            <IBMIndex
              IBMValue={
                bmi
                  ? (bmi.weight / ((bmi.height * bmi.height) / 10000)).toFixed(
                      2
                    )
                  : "---"
              }
              IBMDescription={checkLevel()}
            />
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
});
