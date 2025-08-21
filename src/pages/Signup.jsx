import { useState } from "react";
import { useAxios } from "../hooks";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import ErrorMessage from "../components/ErrorMessage";
import { API_URL } from "../constants";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { request, loading } = useAxios();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await request({
        route: `${API_URL}/auth/signup`,
        method: "POST",
        data: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (response && response.user_id) {
        localStorage.setItem("user_id", response.user_id);

        navigate("/signin");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Signup failed",
      }));
    }
  };

  const navigateToSignin = () => {
    navigate("/signin");
  };

  return (
    <AuthLayout title="Create your account">
      <ErrorMessage message={errors.general} />

      <div className="mt-6 space-y-6">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="pt-2">
          <Button onClick={handleSubmit} loading={loading}>
            Create account
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm" style={{ color: "#E0E0E0" }}>
          Already have an account?{" "}
          <button
            onClick={navigateToSignin}
            className="font-medium transition-colors duration-200"
            style={{
              color: "#1E1E1E",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#1E1E1E")}
            onMouseLeave={(e) => (e.target.style.color = "#1E1E1E")}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
