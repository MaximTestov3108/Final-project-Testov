import sqlite3
import os
from flask import Flask, request, render_template, redirect
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    username = StringField('Логин', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    remember_me = BooleanField('Запомнить меня')
    submit = SubmitField('Войти')


class CommentForm(FlaskForm):
    username = StringField("Псевдоним")
    comment = TextAreaField("Комментарий", validators=[DataRequired()])
    submit = SubmitField('Отправить')


class User():
    def __init__(self, username="", password="", email="", bio=""):
        self.username = username
        self.password = password
        self.email = email
        self.bio = bio

    def setUsername(self, name):
        self.username = name

    def setPassword(self, pswd):
        self.password = pswd

    def setEmail(self, email):
        self.email = email

    def setBio(self, bio):
        self.bio = bio

    def is_logged(self):
        if self.username != "" and self.password != "":
            return True
        else:
            return False

    def exit(self):
        self.username, self.password, self.email, self.bio = "", "", "", ""

    def __eq__(self, other):
        resp = f"username: {self.username == other.username}\n" \
               f"password: {self.password == other.password}\n" \
               f"email: {self.email == other.email}\n"

        return resp

    def __call__(self, *args, **kwargs):
        return f"class User object, username={self.username}m email={self.email}"


app = Flask(__name__)
app.config['SECRET_KEY'] = 'yandexlyceum_secret_key'
user = User()


# def get_text():
# url = 'http://127.0.0.1:8080'
# html_text = requests.get(url).text
# soup = BeautifulSoup(html_text, 'lxml')
# title = soup.find('h2')
# return title

@app.route('/')
@app.route('/index')
def index():
    if user.is_logged():
        return render_template("index.html", name=user.username, enter="Выход")
    else:
        return render_template("index.html", name="Не авторизован", enter="Вход")


@app.route('/registration', methods=['POST', 'GET'])
def form_sample():
    if request.method == 'GET':
        return render_template("registration.html")
    if request.method == 'POST':
        sqlite_connection = sqlite3.connect('ret.db')
        cursor = sqlite_connection.cursor()
        sqlite_insert_query = """INSERT INTO users
                                  (name, email, password, age, about, gender)
                                  VALUES (?,?,?,?,?,?);"""
        count = cursor.execute(sqlite_insert_query, (
            request.form["name"], request.form['email'], request.form["password1"], request.form['class'],
            request.form['about'], request.form['sex']))
        sqlite_connection.commit()
        cursor.close()
        return redirect("/index")


@app.route("/login", methods=['POST', 'GET'])
def login_form():
    if not user.is_logged():
        form = LoginForm()
        if form.validate_on_submit():
            con = sqlite3.connect("ret.db")
            cur = con.cursor()

            result = cur.execute("""SELECT password FROM users
                            WHERE name = ?""", (form.username._value(),)).fetchall()
            if result[0][0] == form.password._value():
                user.setUsername(form.username._value())
                user.setPassword(result[0][0])
                user.setEmail(cur.execute("""SELECT email FROM users
                            WHERE name = ?""", (form.username._value(),)).fetchall()[0][0])
                user.setBio(cur.execute("""SELECT about FROM users
                            WHERE name = ?""", (form.username._value(),)).fetchall()[0][0])

                return redirect("/index")
            else:
                print(result[0][0])
        return render_template("login.html", title="Вход", form=form)
    else:
        user.exit()
        return redirect("/index")


@app.route("/cabinet", methods=['POST', 'GET'])
def cabinet_form():
    if request.method == "GET":
        title = user.username
        sqlite_connection = sqlite3.connect('ret.db')
        cursor = sqlite_connection.cursor()
        try:
            t = """SELECT comments FROM comments WHERE title=?"""
            com = cursor.execute(t, (title,)).fetchall()
        except:
            com = ["Пока ничего нет"]
        print(com)
        return render_template("cabinet.html", username=user.username, bio=user.bio, email=user.email, arr=com)
    elif request.method == "POST":
        return redirect("/index")


@app.route("/comment", methods=['POST', 'GET'])
def comment_form():
    # в первый параметр (псевдоним) это типа придуманное имя чела( не логин) которое указывается по желанию,
    # можешь убрать если хочешь
    if user.is_logged():
        form = CommentForm()
        title = user.username
        if request.method == 'POST':
            sqlite_connection = sqlite3.connect('ret.db')
            cursor = sqlite_connection.cursor()
            sqlite_insert_query = """INSERT INTO comments
                                      (title, comments)
                                      VALUES (?,?);"""
            count = cursor.execute(sqlite_insert_query, (title, str(request.form['comment'])))
            sqlite_connection.commit()
            cursor.close()
            return redirect("/index")
        return render_template("comment.html", title="Комментарий от " + title, form=form)
    else:
        return redirect("/index")


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
