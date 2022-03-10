import System.Environment ( getArgs )

trim = filter (\x -> x /= ' ')

spiralizeMatrix :: Eq a => [[a]] -> [a]
spiralizeMatrix [[]] = []
spiralizeMatrix [x]  = x
spiralizeMatrix matrix = if (or $ map null matrix)
                         then []
                         else top ++ right ++ bottom ++ left ++ (spiralizeMatrix rest)
    where top    = head matrix
          right  = map last . tail . init $ matrix
          bottom = reverse . last $ matrix
          left   = reverse . map head . tail . init $ matrix
          rest   = map (tail . init)  . tail . init $ matrix

main :: IO ()
main = do
    filename  <- head <$> getArgs
    rawMatrix <- readFile filename
    let fixMatrix = trim . init . concat . map (\x -> x ++ " ,") . tail . init . lines
    let fixedMatrix = read ("[" ++ (fixMatrix rawMatrix) ++ "]") :: [[Int]]
    print $ spiralizeMatrix fixedMatrix
