from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import os
import logging


logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']


class TodoListView(APIView):

    def get(self, request):
        try:
            todos = list(db.todos.find({}, {"_id": 0}))
            return Response(todos, status=status.HTTP_200_OK)

        except PyMongoError:
            logger.exception("Failed to fetch TODOs")
            return Response(
                {"error": "Unable to fetch TODOs"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        todo = request.data.get("todo")

        if not isinstance(todo, str) or not todo.strip():
            return Response(
                {"error": "todo is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        todo = todo.strip()

        try:
            db.todos.insert_one({"todo": todo})

            return Response(
                {"todo": todo},
                status=status.HTTP_201_CREATED
            )

        except PyMongoError:
            logger.exception("Failed to create TODO")
            return Response(
                {"error": "Unable to create TODO"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
