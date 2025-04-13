import google.generativeai as genai
genai.configure(api_key="AIzaSyAebNYHHzkXcd4Cg73C80CnVJCimeLt6fM")

for model in genai.list_models():
    print(model.name)