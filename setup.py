from setuptools import setup

setup(
    name="Todo List",
    version="1.0",
    long_description=__doc__,
    packages=["todolist"],
    include_package_data=True,
    zip_safe=False,
    install_requires=["flask", "sqlalchemy", "flask-sqlalchemy", "flask-migrate"],
    setup_requires=["pytest-runner"],
    tests_require=["pytest", "pytest-flask"],
)
